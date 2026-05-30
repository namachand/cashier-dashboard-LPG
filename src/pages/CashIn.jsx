import { useEffect, useMemo, useState } from 'react';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import {
  getDriverCollections,
  getDriverCollectionHistory,
  getTodayOfficeSales,
  recordOfficeSale,
  searchProducts,
  findCustomer,
  verifyDriverCollections,
} from '../services/cashierApi';

function CashIn() {
  const [activeTab, setActiveTab] = useState('driver-collections');
  const [driverCollections, setDriverCollections] = useState([]);
  const [driverLoading, setDriverLoading] = useState(true);
  const [selectedDriverId, setSelectedDriverId] = useState(null);
  const [collectionHistory, setCollectionHistory] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState('');
  const [officeSales, setOfficeSales] = useState([]);
  const [billNumber, setBillNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');
  const [customerResults, setCustomerResults] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [productQuery, setProductQuery] = useState('');
  const [productResults, setProductResults] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [transactionId, setTransactionId] = useState('');
  const [domesticQty, setDomesticQty] = useState(0);
  const [commercialQty, setCommercialQty] = useState(0);
  const [itemsQty, setItemsQty] = useState(0);
  const [notes, setNotes] = useState('');
  const [salesFile, setSalesFile] = useState(null);
  const [officeSaleMessage, setOfficeSaleMessage] = useState('');
  const [officeSaleError, setOfficeSaleError] = useState('');

  const loadCollections = async () => {
    setDriverLoading(true);
    try {
      const response = await getDriverCollections(1, 10);
      if (response?.success && Array.isArray(response.data)) {
        setDriverCollections(response.data);
      }
    } catch (error) {
      console.error('Unable to load driver collections:', error);
    } finally {
      setDriverLoading(false);
    }
  };

  useEffect(() => {
    async function loadOfficeSales() {
      try {
        const response = await getTodayOfficeSales();
        if (response?.success && Array.isArray(response.data)) {
          setOfficeSales(response.data);
        }
      } catch (error) {
        console.error('Unable to load today office sales:', error);
      }
    }

    loadCollections();
    loadOfficeSales();
  }, []);

  const drivers = driverCollections.length
    ? driverCollections.map((driver) => {
        const count =
          driver.status === 'Pending'
            ? driver.pendingCount
            : driver.status === 'Assigned'
            ? driver.assignedCount
            : driver.settledCount;

        return {
          initials: driver.driverName
            .split(' ')
            .map((part) => part[0])
            .join('')
            .slice(0, 2),
          name: driver.driverName,
          route: `${count || 0} collections`,
          cylinders: `${(count || 0) * 2} cylinders`,
          cash: driver.cash,
          upi: driver.upi,
          total: driver.total,
          settled: driver.settled || 0,
          status: driver.status,
          driverId: driver.driver_id,
          pendingCount: driver.pendingCount,
          assignedCount: driver.assignedCount,
          settledCount: driver.settledCount,
        };
      })
    : [];

  const handleVerify = async (driverId) => {
    try {
      const response = await verifyDriverCollections(driverId);
      if (response?.success) {
        await loadCollections();
        if (selectedDriverId === driverId) {
          setSelectedDriverId(null);
          setCollectionHistory(null);
        }
      }
    } catch (error) {
      console.error('Unable to verify driver collections:', error);
    }
  };

  const handleViewDriverHistory = async (driverId) => {
    setSelectedDriverId(driverId);
    setHistoryError('');
    setHistoryLoading(true);
    setCollectionHistory(null);

    try {
      const response = await getDriverCollectionHistory(driverId, 1, 5);
      if (response?.success && response.data) {
        setCollectionHistory(response.data);
      } else {
        setHistoryError('Unable to fetch collection history.');
      }
    } catch (error) {
      console.error('Unable to fetch driver collection history:', error);
      setHistoryError('Unable to fetch collection history.');
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleCustomerSearch = async (value) => {
    setCustomerSearchQuery(value);
    setSelectedCustomer(null);

    if (!value || value.length < 2) {
      setCustomerResults([]);
      return;
    }

    try {
      const response = await findCustomer(value);
      if (response?.success && Array.isArray(response.data)) {
        setCustomerResults(response.data);
      } else {
        setCustomerResults([]);
      }
    } catch (error) {
      console.error('Customer search failed:', error);
      setCustomerResults([]);
    }
  };

  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer);
    setCustomerSearchQuery(customer.name);
    setCustomerName(customer.name);
    setCustomerPhone(customer.phone || '');
    setCustomerAddress(customer.address || '');
    setCustomerResults([]);
  };

  const handleProductSearch = async (value) => {
    setProductQuery(value);
    setSelectedProduct(null);

    if (!value || value.length < 2) {
      setProductResults([]);
      return;
    }

    try {
      const response = await searchProducts(value);
      if (response?.success && Array.isArray(response.data)) {
        setProductResults(response.data);
      } else {
        setProductResults([]);
      }
    } catch (error) {
      console.error('Product search failed:', error);
      setProductResults([]);
    }
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setProductQuery(product.name || '');
    setProductResults([]);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0] || null;
    setSalesFile(file);
  };

  const totalQty = domesticQty + commercialQty + itemsQty;
  const totalAmount = useMemo(() => {
    if (!selectedProduct || !selectedProduct.price) {
      return 0;
    }
    return (selectedProduct.price || Number(selectedProduct.sale_price || 0)) * totalQty;
  }, [selectedProduct, totalQty]);

  const handleSubmitOfficeSale = async () => {
    setOfficeSaleError('');
    setOfficeSaleMessage('');

    if (!selectedCustomer || !billNumber) {
      setOfficeSaleError('Select a customer and enter a bill number.');
      return;
    }

    if (!selectedProduct) {
      setOfficeSaleError('Select a product before adding an entry.');
      return;
    }

    if (totalQty === 0) {
      setOfficeSaleError('Enter at least one sale quantity.');
      return;
    }

    try {
      const items = [
        {
          product_id: Number(selectedProduct.id),
          quantity: totalQty,
          price: Number(selectedProduct.price || selectedProduct.sale_price || 0),
        },
      ];

      const response = await recordOfficeSale({
        customer_name: selectedCustomer.name,
        phone: customerPhone,
        address: customerAddress,
        items,
        payment_method: paymentMethod,
      });

      if (response?.success) {
        setOfficeSaleMessage(response.message || 'Office sale added successfully');
        setSelectedCustomer(null);
        setCustomerSearchQuery('');
        setCustomerPhone('');
        setCustomerAddress('');
        setSelectedProduct(null);
        setProductQuery('');
        setBillNumber('');
        setDomesticQty(0);
        setCommercialQty(0);
        setItemsQty(0);
        setTransactionId('');
        setNotes('');
        setSalesFile(null);
        const saleResponse = await getTodayOfficeSales();
        if (saleResponse?.success && Array.isArray(saleResponse.data)) {
          setOfficeSales(saleResponse.data);
        }
      } else {
        setOfficeSaleError(response?.message || 'Unable to submit office sale.');
      }
    } catch (error) {
      console.error('Office sale submission failed:', error);
      setOfficeSaleError('Unable to submit office sale.');
    }
  };

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="page-content">
        <Header />
        <main className="page-main">
          <div className="page-header-section">
            <h1>Cash In</h1>
            <p>Verify driver collections, office sales and other receipts</p>
          </div>

          <div className="cash-in-tabs">
            <div className="tab-buttons">
              {[
                { id: 'driver-collections', label: 'Driver Collections' },
                { id: 'office-sales', label: 'Office Sales' },
                { id: 'cashier-requests', label: 'Cashier Requests' },
                { id: 'other-receipts', label: 'Other Receipts' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === 'driver-collections' && (
              <section className="tab-content">
                <div className="tab-header">
                  <div>
                    <h2>Driver Collections · {drivers.length}</h2>
                    <p>Auto-fetched from delivery system. Verify before confirming.</p>
                  </div>
                  <button className="filter-button">🔽 Filter</button>
                </div>

                <div className="table-container">
                  <table className="cash-in-table">
                    <thead>
                      <tr>
                        <th>DRIVER</th>
                        <th>ROUTE</th>
                        <th>CASH</th>
                        <th>UPI</th>
                        <th>TOTAL</th>
                        <th>SETTLED</th>
                        <th>STATUS</th>
                        <th>ACTION</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(driverLoading ? [] : drivers).map((driver) => (
                        <tr key={driver.driverId}>
                          <td className="driver-cell">
                            <div className="driver-avatar">{driver.initials}</div>
                            <div>
                              <strong>{driver.name}</strong>
                              <div className="driver-meta">{driver.cylinders}</div>
                            </div>
                          </td>
                          <td>{driver.route}</td>
                          <td>₹{driver.cash.toLocaleString('en-IN')}</td>
                          <td>₹{driver.upi.toLocaleString('en-IN')}</td>
                          <td className="total-cell">₹{driver.total.toLocaleString('en-IN')}</td>
                          <td>₹{driver.settled.toLocaleString('en-IN')}</td>
                          <td>
                            <span className={`status-badge ${driver.status.toLowerCase()}`}>
                              {driver.status}
                            </span>
                          </td>
                          <td className="action-cell">
                            <button
                              className="icon-btn"
                              type="button"
                              onClick={() => handleViewDriverHistory(driver.driverId)}
                            >
                              👁
                            </button>
                            {driver.status === 'Pending' && (
                              <button
                                className="verify-btn"
                                type="button"
                                onClick={() => handleVerify(driver.driverId)}
                              >
                                ✓ Verify
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {selectedDriverId && (
                  <div className="driver-history-panel">
                    <h3>Collection history</h3>
                    <p>Driver ID: {selectedDriverId}</p>
                    {historyLoading ? (
                      <p>Loading history...</p>
                    ) : historyError ? (
                      <p className="error-message">{historyError}</p>
                    ) : collectionHistory?.items?.length ? (
                      <div className="history-list">
                        {collectionHistory.items.map((item) => (
                          <div key={item.date} className="history-card">
                            <div className="history-card-header">
                              <strong>{item.date}</strong>
                              <span>₹{item.totalAmount.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="history-card-body">
                              <div>Cash: ₹{item.summary.cash.amount.toLocaleString('en-IN')}</div>
                              <div>UPI: ₹{item.summary.upi.amount.toLocaleString('en-IN')}</div>
                              <div>Status: {item.summary.cash.status || item.summary.upi.status || 'PENDING_APPROVAL'}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p>No settled history available for this driver.</p>
                    )}
                  </div>
                )}
              </section>
            )}

            {activeTab === 'office-sales' && (
              <section className="tab-content office-sales-tab">
                <div className="office-sales-layout">
                  <div className="sales-card">
                    <div className="section-heading">
                      <h2>Today's Office Sales</h2>
                      <p>Walk-in customer entries</p>
                    </div>
                    <div className="sales-table">
                      <div className="sales-header">
                        <div>BILL #</div>
                        <div>CUSTOMER</div>
                        <div>NOTES</div>
                        <div>AMOUNT</div>
                      </div>
                      {officeSales.map((sale) => (
                        <div key={sale.billId} className="sales-row">
                          <div className="bill-id">{sale.billId}</div>
                          <div className="customer-name">{sale.customer}</div>
                          <div className="notes-cell">{sale.notes}</div>
                          <div className="amount-cell">₹{sale.amount.toLocaleString('en-IN')}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="add-entry-card">
                    <div className="section-heading">
                      <h2>Add Entry</h2>
                      <p>Manual office sale</p>
                    </div>
                    <div className="form-grid">
                      <div className="form-group customer-search-group">
                        <label>Customer Name</label>
                        <input
                          type="text"
                          value={customerSearchQuery}
                          onChange={(event) => handleCustomerSearch(event.target.value)}
                          placeholder="e.g. Sharma Restaurant"
                        />
                        {customerResults.length > 0 && (
                          <div className="search-results">
                            {customerResults.map((customer) => (
                              <button
                                type="button"
                                key={customer.id}
                                className="search-item"
                                onClick={() => handleSelectCustomer(customer)}
                              >
                                <span>{customer.name}</span>
                                <span>{customer.phone}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="form-group">
                        <label>Bill Number</label>
                        <input
                          type="text"
                          value={billNumber}
                          onChange={(event) => setBillNumber(event.target.value)}
                          placeholder="B-2422"
                        />
                      </div>
                      <div className="form-group product-search-group">
                        <label>Product</label>
                        <input
                          type="text"
                          className="product-search-input"
                          value={productQuery}
                          onChange={(event) => handleProductSearch(event.target.value)}
                          placeholder="Search products..."
                        />
                        {productResults.length > 0 && (
                          <div className="search-results">
                            {productResults.map((product) => (
                              <button
                                type="button"
                                key={product.id}
                                className="search-item"
                                onClick={() => handleSelectProduct(product)}
                              >
                                <span>{product.name}</span>
                                <span>₹{Number(product.price || product.sale_price || 0).toLocaleString('en-IN')}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      {selectedProduct && (
                        <div className="selected-product">
                          <p>{selectedProduct.name}</p>
                          <p>Rate: ₹{Number(selectedProduct.price || selectedProduct.sale_price || 0).toLocaleString('en-IN')}</p>
                        </div>
                      )}
                      <div className="cylinder-sales-grid">
                        <div className="sales-input-group">
                          <span className="sales-input-label">Domestic</span>
                          <input
                            type="number"
                            min="0"
                            value={domesticQty}
                            onChange={(event) => setDomesticQty(Number(event.target.value))}
                          />
                        </div>
                        <div className="sales-input-group">
                          <span className="sales-input-label">Commercial</span>
                          <input
                            type="number"
                            min="0"
                            value={commercialQty}
                            onChange={(event) => setCommercialQty(Number(event.target.value))}
                          />
                        </div>
                        <div className="sales-input-group">
                          <span className="sales-input-label">Items</span>
                          <input
                            type="number"
                            min="0"
                            value={itemsQty}
                            onChange={(event) => setItemsQty(Number(event.target.value))}
                          />
                        </div>
                      </div>
                      <p className="field-note">Enter qty for domestic refills, commercial 19kg, and accessory items</p>
                      <div className="form-group">
                        <label>Total Amount</label>
                        <input type="text" value={`₹ ${totalAmount.toLocaleString('en-IN')}`} readOnly />
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Payment Mode</label>
                          <select value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)}>
                            <option value="CASH">Cash</option>
                            <option value="UPI">UPI</option>
                            <option value="CARD">Card</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Bank Transfer ID / UTR</label>
                          <input
                            type="text"
                            value={transactionId}
                            onChange={(event) => setTransactionId(event.target.value)}
                            placeholder="UTR / Txn ID (optional)"
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Notes</label>
                        <textarea
                          value={notes}
                          onChange={(event) => setNotes(event.target.value)}
                          placeholder="Optional details..."
                        />
                      </div>
                      <div className="file-upload-card">
                        <input id="sales-file-upload" type="file" onChange={handleFileUpload} />
                        <label htmlFor="sales-file-upload" className="upload-label">
                          <div className="upload-icon">⬆</div>
                          <div>
                            <strong>Upload sales details</strong>
                            <div>CSV, XLSX, PDF or image · Max 10 MB</div>
                          </div>
                        </label>
                        {salesFile && <p className="upload-info">Selected file: {salesFile.name}</p>}
                      </div>
                      <button type="button" className="add-entry-btn" onClick={handleSubmitOfficeSale}>
                        + Add Entry
                      </button>
                      {officeSaleMessage && <div className="success-box">{officeSaleMessage}</div>}
                      {officeSaleError && <div className="error-box">{officeSaleError}</div>}
                      <p className="form-note">Duplicate bill numbers are blocked automatically</p>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {activeTab === 'cashier-requests' && (
              <section className="tab-content cashier-requests-tab">
                <div className="requests-layout">
                  <div className="requests-sidebar">
                    <div className="request-header">
                      <h2>Customer service charge collections</h2>
                      <p>Raise charge requests against customer / consumer accounts. All entries auto-post to today's cash-in ledger.</p>
                      <p className="request-id">📋 Auto-numbered · REC-1843</p>
                    </div>
                    <div className="request-types">
                      {[
                        { type: 'PR Penalty', title: 'Pressure regulator penalty charge' },
                        { type: 'Name Change', title: 'Update connection folder name' },
                        { type: 'OTV', title: 'One Time Verification charge' },
                        { type: 'Transfer Voucher', title: 'Connection transfer / shifting' },
                      ].map((req) => (
                        <div key={req.type} className="request-type-card">
                          <div className="request-icon">🔒</div>
                          <strong>{req.type}</strong>
                          <p>{req.title}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="request-form-area">
                    <h3>1. PR Penalty — Customer Details</h3>
                    <p className="form-info">Fill all required fields. Receipt auto-generated on submission.</p>
                    <form className="request-form">
                      <div className="form-row">
                        <div className="form-field">
                          <label>Customer Name</label>
                          <input type="text" placeholder="e.g. Anita Sharma" />
                        </div>
                        <div className="form-field">
                          <label>Consumer Number</label>
                          <input type="text" placeholder="DOR-XXXXXXX" />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-field">
                          <label>Mobile Number</label>
                          <input type="tel" placeholder="+91 9XXXXXXXXX" />
                        </div>
                        <div className="form-field">
                          <label>Connection ID / SV No.</label>
                          <input type="text" placeholder="SV-2824-XXXX" />
                        </div>
                      </div>
                      <div className="form-field">
                        <label>Address</label>
                        <input type="text" placeholder="House no, street, area, city, PIN" />
                      </div>
                      <div className="form-row">
                        <div className="form-field">
                          <label>Charge Amount</label>
                          <input type="number" defaultValue="250" />
                        </div>
                        <div className="form-field">
                          <label>Payment Mode</label>
                          <select>
                            <option>Cash</option>
                          </select>
                        </div>
                      </div>
                      <div className="form-field">
                        <label>Bank Transfer ID / UTR</label>
                        <input type="text" placeholder="UTR / Txn ID (required for non-cash)" />
                      </div>
                      <div className="form-field">
                        <label>Remarks</label>
                        <textarea placeholder="Optional notes for audit trail..."></textarea>
                      </div>
                      <div className="form-actions">
                        <button type="button" className="submit-btn">✓ Submit & Generate Receipt</button>
                        <button type="button" className="reset-btn">Reset</button>
                      </div>
                    </form>

                    <div className="recent-section">
                      <h3>Recent Requests</h3>
                      <p className="section-date">Today</p>
                      <div className="recent-list">
                        <div className="recent-item">
                          <div className="request-info">
                            <p className="request-id">RES-1843</p>
                            <strong>Anita Sharma</strong>
                            <small>PR Penalty · DOM-558821</small>
                          </div>
                          <div className="request-status">
                            <span className="status-badge pending">pending</span>
                            <span className="amount">₹250</span>
                          </div>
                        </div>
                        <div className="recent-item">
                          <div className="request-info">
                            <p className="request-id">RES-1842</p>
                            <strong>Rohit Mehra</strong>
                            <small>Name Change · DOM-551720</small>
                          </div>
                          <div className="request-status">
                            <span className="status-badge approved">approved</span>
                            <span className="amount">₹100</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {activeTab === 'other-receipts' && (
              <section className="tab-content other-receipts-tab">
                <div className="receipts-layout">
                  <div className="add-receipt-form">
                    <h2>Add Receipt</h2>
                    <p>Advances, due collections, miscellaneous</p>
                    <form>
                      <div className="form-group">
                        <label>Type</label>
                        <div className="type-buttons">
                          <button type="button" className="type-btn">Advance</button>
                          <button type="button" className="type-btn active">Due Collection</button>
                          <button type="button" className="type-btn">Other</button>
                        </div>
                      </div>
                      <div className="form-field">
                        <label>Amount</label>
                        <input type="text" placeholder="₹ 0" />
                      </div>
                      <div className="form-field">
                        <label>Description</label>
                        <input type="text" placeholder="From whom / what" />
                      </div>
                      <div className="form-row">
                        <div className="form-field">
                          <label>Payment Mode</label>
                          <select>
                            <option>Cash</option>
                          </select>
                        </div>
                        <div className="form-field">
                          <label>Bank Transfer ID / UTR</label>
                          <input type="text" placeholder="UTR / Txn ID (optional)" />
                        </div>
                      </div>
                      <button type="button" className="add-receipt-btn">+ Add Receipt</button>
                    </form>
                  </div>

                  <div className="recent-receipts">
                    <h2>Recent Receipts</h2>
                    <p className="section-date">Today</p>
                    <div className="receipt-list">
                      {[
                        { category: 'DUE COLLECTION', name: 'Mehta Hotel - pending dues', amount: 8400 },
                        { category: 'ADVANCE', name: 'Krishna Caterers - cylinder advance', amount: 5000 },
                        { category: 'OTHER', name: 'Empty cylinder return refund', amount: 1200 },
                      ].map((receipt, index) => (
                        <div key={index} className="receipt-item">
                          <div className="receipt-category">{receipt.category}</div>
                          <strong>{receipt.name}</strong>
                          <span className="receipt-amount">{receipt.amount}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default CashIn;
