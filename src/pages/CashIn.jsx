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
  getCashierPenaltyRequests,
  collectCashierPenaltyRequest,
  getCashierNameChangeRequests,
  collectCashierNameChangeRequest,
  getCashierTransferVoucherRequests,
  collectCashierTransferVoucherRequest,
  getCashierNewConnectionRequests,
  collectCashierNewConnectionRequest,
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
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [partCash, setPartCash] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [notes, setNotes] = useState('');
  const [salesFile, setSalesFile] = useState(null);
  const [officeSaleMessage, setOfficeSaleMessage] = useState('');
  const [officeSaleError, setOfficeSaleError] = useState('');

  const [cashierPenaltyRequests, setCashierPenaltyRequests] = useState([]);
  const [cashierPenaltyLoading, setCashierPenaltyLoading] = useState(false);
  const [cashierPenaltyError, setCashierPenaltyError] = useState('');
  const [selectedPenaltyRequestId, setSelectedPenaltyRequestId] = useState(null);
  const [requestPaymentMode, setRequestPaymentMode] = useState('CASH');
  const [requestPaymentId, setRequestPaymentId] = useState('');
  const [requestRemarks, setRequestRemarks] = useState('');
  const [requestSubmitting, setRequestSubmitting] = useState(false);
  const [activeCashierRequestType, setActiveCashierRequestType] = useState('PR Penalty');

  const [cashierNameChangeRequests, setCashierNameChangeRequests] = useState([]);
  const [cashierNameChangeLoading, setCashierNameChangeLoading] = useState(false);
  const [selectedNameChangeRequestId, setSelectedNameChangeRequestId] = useState(null);
  const [cashierTransferVoucherRequests, setCashierTransferVoucherRequests] = useState([]);
  const [cashierTransferVoucherLoading, setCashierTransferVoucherLoading] = useState(false);
  const [selectedTransferVoucherRequestId, setSelectedTransferVoucherRequestId] = useState(null);
  const [cashierNewConnectionRequests, setCashierNewConnectionRequests] = useState([]);
  const [cashierNewConnectionLoading, setCashierNewConnectionLoading] = useState(false);
  const [selectedNewConnectionRequestId, setSelectedNewConnectionRequestId] = useState(null);

  // Editable cashier request form fields. These stay empty/editable by default
  // and are prefilled when a pending request card is selected.
  const [cashierFormCustomerName, setCashierFormCustomerName] = useState('');
  const [cashierFormConsumerNumber, setCashierFormConsumerNumber] = useState('');
  const [cashierFormMobileNumber, setCashierFormMobileNumber] = useState('');
  const [cashierFormConnectionIdOrHolder, setCashierFormConnectionIdOrHolder] = useState('');
  const [cashierFormAddress, setCashierFormAddress] = useState('');
  const [cashierFormOldName, setCashierFormOldName] = useState('');
  const [cashierFormNewName, setCashierFormNewName] = useState('');
  const [cashierFormAmount, setCashierFormAmount] = useState('');

  // Cashier request customer search states
  const [cashierRequestCustomerSearchQuery, setCashierRequestCustomerSearchQuery] = useState('');
  const [cashierRequestCustomerResults, setCashierRequestCustomerResults] = useState([]);
  const [cashierRequestCustomerSearchTimeout, setCashierRequestCustomerSearchTimeout] = useState(null);

  // Transfer voucher state selection
  const [transferVoucherStateType, setTransferVoucherStateType] = useState('INTRA_STATE');
  const [transferVoucherFromState, setTransferVoucherFromState] = useState('');
  const [transferVoucherToState, setTransferVoucherToState] = useState('');

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

  const loadCashierPenaltyRequests = async () => {
    setCashierPenaltyLoading(true);
    setCashierPenaltyError('');
    try {
      const response = await getCashierPenaltyRequests('ALL');
      if (response?.success && Array.isArray(response.data)) {
        setCashierPenaltyRequests(response.data);
      } else {
        setCashierPenaltyRequests([]);
      }
    } catch (error) {
      console.error('Unable to load cashier penalty requests:', error);
      setCashierPenaltyError('Unable to load cashier requests.');
      setCashierPenaltyRequests([]);
    } finally {
      setCashierPenaltyLoading(false);
    }
  };

  const loadCashierNameChangeRequests = async () => {
    setCashierNameChangeLoading(true);
    setCashierPenaltyError('');
    try {
      const response = await getCashierNameChangeRequests('ALL');
      if (response?.success && Array.isArray(response.data)) {
        setCashierNameChangeRequests(response.data);
      } else {
        setCashierNameChangeRequests([]);
      }
    } catch (error) {
      console.error('Unable to load cashier name change requests:', error);
      setCashierPenaltyError('Unable to load cashier requests.');
      setCashierNameChangeRequests([]);
    } finally {
      setCashierNameChangeLoading(false);
    }
  };

  const loadCashierTransferVoucherRequests = async () => {
    setCashierTransferVoucherLoading(true);
    setCashierPenaltyError('');
    try {
      const response = await getCashierTransferVoucherRequests('ALL');
      if (response?.success && Array.isArray(response.data)) {
        setCashierTransferVoucherRequests(response.data);
      } else {
        setCashierTransferVoucherRequests([]);
      }
    } catch (error) {
      console.error('Unable to load cashier transfer voucher requests:', error);
      setCashierPenaltyError('Unable to load cashier requests.');
      setCashierTransferVoucherRequests([]);
    } finally {
      setCashierTransferVoucherLoading(false);
    }
  };

  const loadCashierNewConnectionRequests = async () => {
    setCashierNewConnectionLoading(true);
    setCashierPenaltyError('');
    try {
      const response = await getCashierNewConnectionRequests('ALL');
      if (response?.success && Array.isArray(response.data)) {
        setCashierNewConnectionRequests(response.data);
      } else {
        setCashierNewConnectionRequests([]);
      }
    } catch (error) {
      console.error('Unable to load cashier new connection requests:', error);
      setCashierPenaltyError('Unable to load cashier requests.');
      setCashierNewConnectionRequests([]);
    } finally {
      setCashierNewConnectionLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'cashier-requests') {
      loadCashierPenaltyRequests();
      loadCashierNameChangeRequests();
      loadCashierTransferVoucherRequests();
      loadCashierNewConnectionRequests();
    }
  }, [activeTab]);

  const selectedPenaltyRequest = useMemo(
    () => cashierPenaltyRequests.find((item) => Number(item.id) === Number(selectedPenaltyRequestId)) || null,
    [cashierPenaltyRequests, selectedPenaltyRequestId]
  );

  const selectedNameChangeRequest = useMemo(
    () => cashierNameChangeRequests.find((item) => Number(item.id) === Number(selectedNameChangeRequestId)) || null,
    [cashierNameChangeRequests, selectedNameChangeRequestId]
  );

  const selectedTransferVoucherRequest = useMemo(
    () =>
      cashierTransferVoucherRequests.find((item) => Number(item.id) === Number(selectedTransferVoucherRequestId)) || null,
    [cashierTransferVoucherRequests, selectedTransferVoucherRequestId]
  );

  const selectedNewConnectionRequest = useMemo(
    () =>
      cashierNewConnectionRequests.find((item) => Number(item.id) === Number(selectedNewConnectionRequestId)) || null,
    [cashierNewConnectionRequests, selectedNewConnectionRequestId]
  );

  const isPenaltyType = activeCashierRequestType === 'PR Penalty';
  const isNameChangeType = activeCashierRequestType === 'Name Change';
  const isTransferVoucherType = activeCashierRequestType === 'Transfer Voucher';
  const isNewConnectionType = activeCashierRequestType === 'New Connection';

  const selectedCashierRequest = isPenaltyType
    ? selectedPenaltyRequest
    : isNameChangeType
    ? selectedNameChangeRequest
    : isNewConnectionType
    ? selectedNewConnectionRequest
    : selectedTransferVoucherRequest;

  const activeCashierRequests = isPenaltyType
    ? cashierPenaltyRequests
    : isNameChangeType
    ? cashierNameChangeRequests
    : isNewConnectionType
    ? cashierNewConnectionRequests
    : cashierTransferVoucherRequests;

  const activeCashierRequestsLoading = isPenaltyType
    ? cashierPenaltyLoading
    : isNameChangeType
    ? cashierNameChangeLoading
    : isNewConnectionType
    ? cashierNewConnectionLoading
    : cashierTransferVoucherLoading;

  const resetEditableCashierCustomerFields = () => {
    setCashierFormCustomerName('');
    setCashierFormConsumerNumber('');
    setCashierFormMobileNumber('');
    setCashierFormConnectionIdOrHolder('');
    setCashierFormAddress('');
    setCashierFormOldName('');
    setCashierFormNewName('');
    setCashierFormAmount('');
  };

  const populateCashierCustomerFieldsFromRequest = (request) => {
    if (isTransferVoucherType) {
      setCashierFormCustomerName(request.newName || request.customerName || '');
      setCashierFormConsumerNumber(request.consumerNumber || '');
      setCashierFormMobileNumber(request.newMobile || request.phone || '');
      setCashierFormConnectionIdOrHolder(request.oldName || '');
      setCashierFormAddress(request.newAddress || request.address || '');
      setCashierFormOldName('');
      setCashierFormNewName('');
      setCashierFormAmount(request.amount ?? '');
      return;
    }

    if (isNameChangeType) {
      setCashierFormCustomerName(request.customerName || '');
      setCashierFormConsumerNumber(request.consumerNumber || '');
      setCashierFormMobileNumber(request.phone || '');
      setCashierFormConnectionIdOrHolder(request.consumerNumber || '');
      setCashierFormAddress(request.address || '');
      setCashierFormOldName(request.oldName || '');
      setCashierFormNewName(request.newName || '');
      setCashierFormAmount(request.amount ?? '');
      return;
    }

    if (isNewConnectionType) {
      setCashierFormCustomerName(request.customerName || '');
      setCashierFormConsumerNumber(request.consumerNumber || '');
      setCashierFormMobileNumber(request.phone || '');
      setCashierFormConnectionIdOrHolder(request.connectionId || request.consumerNumber || '');
      setCashierFormAddress(request.address || '');
      setCashierFormOldName('');
      setCashierFormNewName('');
      setCashierFormAmount(request.amount ?? '');
      return;
    }

    setCashierFormCustomerName(request.customerName || '');
    setCashierFormConsumerNumber(request.consumerNumber || '');
    setCashierFormMobileNumber(request.phone || '');
    setCashierFormConnectionIdOrHolder(request.consumerNumber || '');
    setCashierFormAddress(request.address || '');
    setCashierFormOldName('');
    setCashierFormNewName('');
    setCashierFormAmount(request.amount ?? '');
  };

  const handleSelectPenaltyRequest = (request) => {
    if (request.status !== 'PENDING') {
      return;
    }

    setRequestPaymentMode(request.paymentMode || 'CASH');
    setRequestPaymentId(request.paymentId || '');
    setRequestRemarks(request.remarks || '');
    setCashierPenaltyError('');
    populateCashierCustomerFieldsFromRequest(request);

    if (isPenaltyType) {
      setSelectedPenaltyRequestId(request.id);
    } else if (isNameChangeType) {
      setSelectedNameChangeRequestId(request.id);
    } else if (isNewConnectionType) {
      setSelectedNewConnectionRequestId(request.id);
    } else {
      setSelectedTransferVoucherRequestId(request.id);
    }
  };

  const handleCashierTypeChange = (nextType) => {
    setActiveCashierRequestType(nextType);
    setCashierPenaltyError('');

    // Keep forms empty by default; prefill only when cashier explicitly clicks a pending request card.
    setSelectedPenaltyRequestId(null);
    setSelectedNameChangeRequestId(null);
    setSelectedTransferVoucherRequestId(null);
    setSelectedNewConnectionRequestId(null);
    setRequestPaymentMode('CASH');
    setRequestPaymentId('');
    setRequestRemarks('');
    setTransferVoucherStateType('INTRA_STATE');
    setTransferVoucherFromState('');
    setTransferVoucherToState('');
    resetEditableCashierCustomerFields();
    setCashierRequestCustomerSearchQuery('');
    setCashierRequestCustomerResults([]);
  };

  const handleResetPenaltyRequestForm = () => {
    // Always reset editable cashier fields regardless of selected request type.
    setRequestPaymentMode('CASH');
    setRequestPaymentId('');
    setRequestRemarks('');

    // Reset transfer voucher specific editable fields.
    setTransferVoucherStateType('INTRA_STATE');
    setTransferVoucherFromState('');
    setTransferVoucherToState('');
    resetEditableCashierCustomerFields();

    // Clear request search helpers.
    setCashierPenaltyError('');
    setCashierRequestCustomerSearchQuery('');
    setCashierRequestCustomerResults([]);

    // Deselect cards in all cashier request sections.
    setSelectedPenaltyRequestId(null);
    setSelectedNameChangeRequestId(null);
    setSelectedTransferVoucherRequestId(null);
    setSelectedNewConnectionRequestId(null);
  };

  const handleCashierRequestCustomerSearch = (value) => {
    setCashierRequestCustomerSearchQuery(value);
    
    // Clear previous timeout
    if (cashierRequestCustomerSearchTimeout) {
      clearTimeout(cashierRequestCustomerSearchTimeout);
    }

    if (!value || value.length < 2) {
      setCashierRequestCustomerResults([]);
      return;
    }

    // Set debounce timeout for search
    const timeout = setTimeout(async () => {
      try {
        const response = await findCustomer(value);
        if (response?.success && Array.isArray(response.data)) {
          setCashierRequestCustomerResults(response.data);
        } else {
          setCashierRequestCustomerResults([]);
        }
      } catch (error) {
        console.error('Cashier request customer search failed:', error);
        setCashierRequestCustomerResults([]);
      }
    }, 300);

    setCashierRequestCustomerSearchTimeout(timeout);
  };

  const handleSelectCashierRequestCustomer = (customer) => {
    // Find and select matching request from active requests
    const matchingRequest = activeCashierRequests?.find(
      (req) => Number(req.customerId ?? req.customer_id) === Number(customer.id) && req.status === 'PENDING'
    );

    if (matchingRequest) {
      handleSelectPenaltyRequest(matchingRequest);
    }

    // Clear search
    setCashierRequestCustomerSearchQuery('');
    setCashierRequestCustomerResults([]);
  };

  const handleSubmitPenaltyRequest = async () => {
    setCashierPenaltyError('');

    if (!selectedCashierRequest || selectedCashierRequest.status !== 'PENDING') {
      setCashierPenaltyError('Select a pending request to collect payment.');
      return;
    }

    if (requestPaymentMode !== 'CASH' && !String(requestPaymentId || '').trim()) {
      setCashierPenaltyError('Payment ID is required for non-cash modes.');
      return;
    }

    setRequestSubmitting(true);
    try {
      const payload = {
        paymentMode: requestPaymentMode,
        paymentId: requestPaymentId,
        remarks: requestRemarks,
      };

      // Add transfer state information for transfer voucher requests
      if (isTransferVoucherType) {
        payload.transferStateType = transferVoucherStateType;
        payload.fromState = transferVoucherFromState;
        payload.toState = transferVoucherToState;
      }

      const response =
        isPenaltyType
          ? await collectCashierPenaltyRequest(selectedCashierRequest.id, payload)
          : isNameChangeType
          ? await collectCashierNameChangeRequest(selectedCashierRequest.id, payload)
          : isNewConnectionType
          ? await collectCashierNewConnectionRequest(selectedCashierRequest.id, payload)
          : await collectCashierTransferVoucherRequest(selectedCashierRequest.id, payload);

      if (!response?.success) {
        setCashierPenaltyError(response?.message || 'Unable to submit request.');
        return;
      }

      if (isPenaltyType) {
        await loadCashierPenaltyRequests();
      } else if (isNameChangeType) {
        await loadCashierNameChangeRequests();
      } else if (isNewConnectionType) {
        await loadCashierNewConnectionRequests();
      } else {
        await loadCashierTransferVoucherRequests();
      }

      handleResetPenaltyRequestForm();
    } catch (error) {
      console.error('Unable to submit cashier penalty request:', error);
      setCashierPenaltyError(error?.message || 'Unable to submit request.');
    } finally {
      setRequestSubmitting(false);
    }
  };

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
    setOfficeSaleError('');

    if (selectedProducts.some((item) => Number(item.id) === Number(product.id))) {
      setOfficeSaleError('This product is already selected.');
      return;
    }

    if (selectedProducts.length >= 2) {
      setOfficeSaleError('You can select up to 2 products per office sale.');
      return;
    }

    const price = Number(product.price || product.sale_price || 0);
    setSelectedProducts((prev) => [
      ...prev,
      {
        id: Number(product.id),
        name: product.name || '',
        type: String(product.type || '').toUpperCase(),
        price,
        quantity: 0,
      },
    ]);

    setProductQuery('');
    setProductResults([]);
  };

  const handleRemoveProduct = (productId) => {
    setSelectedProducts((prev) => prev.filter((item) => Number(item.id) !== Number(productId)));
  };

  const handleProductQtyChange = (productId, value) => {
    const nextQty = Math.max(0, Number(value) || 0);
    setSelectedProducts((prev) =>
      prev.map((item) =>
        Number(item.id) === Number(productId)
          ? {
              ...item,
              quantity: nextQty,
            }
          : item
      )
    );
  };

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0] || null;
    setSalesFile(file);
  };

  const totalQty = selectedProducts.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  const totalAmount = useMemo(() => {
    return selectedProducts.reduce(
      (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
      0
    );
  }, [selectedProducts]);

  const handleSubmitOfficeSale = async () => {
    setOfficeSaleError('');
    setOfficeSaleMessage('');

    if (!selectedCustomer || !billNumber) {
      setOfficeSaleError('Select a customer and enter a bill number.');
      return;
    }

    if (!selectedProducts.length) {
      setOfficeSaleError('Select at least one product before adding an entry.');
      return;
    }

    const items = selectedProducts
      .filter((item) => Number(item.quantity) > 0)
      .map((item) => ({
        product_id: Number(item.id),
        quantity: Number(item.quantity),
        price: Number(item.price || 0),
      }));

    if (!items.length) {
      setOfficeSaleError('Enter quantity for at least one selected product.');
      return;
    }

    try {
      const response = await recordOfficeSale({
        customer_name: selectedCustomer.name,
        phone: customerPhone,
        address: customerAddress,
        items,
        payment_method: paymentMethod,
        cash_amount: paymentMethod === 'PART_PAYMENT' ? Number(partCash || 0) : undefined,
        transaction_id: transactionId || undefined,
      });

      if (response?.success) {
        setOfficeSaleMessage(response.message || 'Office sale added successfully');
        setSelectedCustomer(null);
        setCustomerSearchQuery('');
        setCustomerPhone('');
        setCustomerAddress('');
        setSelectedProducts([]);
        setProductQuery('');
        setBillNumber('');
        setTransactionId('');
        setPartCash('');
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
                          placeholder="Search products... (max 2)"
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
                      {selectedProducts.length > 0 && (
                        <div className="selected-product">
                          {selectedProducts.map((product) => (
                            <div key={product.id} className="sales-input-group" style={{ marginBottom: '10px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <strong>{product.name}</strong>
                                <button
                                  type="button"
                                  className="icon-btn"
                                  onClick={() => handleRemoveProduct(product.id)}
                                >
                                  ✕
                                </button>
                              </div>
                              <span className="sales-input-label">
                                {product.type === 'COMMERCIAL' ? 'Commercial Qty' : 'Domestic Qty'} · Rate ₹{Number(product.price || 0).toLocaleString('en-IN')}
                              </span>
                              <input
                                type="number"
                                min="0"
                                value={product.quantity}
                                onChange={(event) => handleProductQtyChange(product.id, event.target.value)}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                      <p className="field-note">Select up to 2 products and enter quantity for each selected domestic/commercial product</p>
                      <div className="form-group">
                        <label>Total Amount</label>
                        <input type="text" value={`₹ ${totalAmount.toLocaleString('en-IN')}`} readOnly />
                      </div>
                      <div className="form-group">
                        <label>Payment Mode</label>
                        <select value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)}>
                          <option value="CASH">Cash</option>
                          <option value="UPI">UPI</option>
                          <option value="CARD">Card</option>
                          <option value="PART_PAYMENT">Part Payment</option>
                        </select>
                      </div>
                      {paymentMethod === 'PART_PAYMENT' ? (
                        <>
                          <div className="form-row">
                            <div className="form-group">
                              <label>Cash Amount</label>
                              <input
                                type="number"
                                min="0"
                                value={partCash}
                                onChange={(event) => setPartCash(event.target.value)}
                                placeholder="Cash portion"
                              />
                            </div>
                            <div className="form-group">
                              <label>Bank Transfer ID / UTR</label>
                              <input
                                type="text"
                                value={transactionId}
                                onChange={(event) => setTransactionId(event.target.value)}
                                placeholder="UTR / Txn ID"
                              />
                            </div>
                          </div>
                          <p className="field-note">
                            Bank transfer amount: ₹{Math.max(totalAmount - Number(partCash || 0), 0).toLocaleString('en-IN')}
                          </p>
                        </>
                      ) : (
                        <div className="form-group">
                          <label>Bank Transfer ID / UTR</label>
                          <input
                            type="text"
                            value={transactionId}
                            onChange={(event) => setTransactionId(event.target.value)}
                            placeholder="UTR / Txn ID (optional)"
                          />
                        </div>
                      )}
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
                <div className="cashier-requests-shell">
                  <div className="request-header">
                    <h2>Customer service charge collections</h2>
                    <p>All pending PR penalty requests from Customer Issues dashboard appear here for cashier collection.</p>
                  </div>

                  <div className="request-types-top">
                    {[
                      { type: 'PR Penalty', title: 'Pressure regulator penalty charge' },
                      { type: 'Name Change', title: 'Update connection holder name' },
                      { type: 'New Connection', title: 'New connection will appear here' },
                      { type: 'Transfer Voucher', title: 'Connection transfer / shifting' },
                    ].map((req) => (
                      <article
                        key={req.type}
                        className={`request-type-card ${activeCashierRequestType === req.type ? 'active' : ''}`}
                        onClick={() => handleCashierTypeChange(req.type)}
                      >
                        <div className="request-icon" style={{backgroundColor: req.type === 'PR Penalty' ? '#091b31' : '#f7f0f1'}}>
                          {req.type === 'PR Penalty' && (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: '#ffffff'}}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path></svg>
                          )}
                          {req.type === 'Name Change' && (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><path d="M16 3.128a4 4 0 0 1 0 7.744"></path><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><circle cx="9" cy="7" r="4"></circle></svg>
                          )}
                          {req.type === 'New Connection' && (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><line x1="19" x2="19" y1="8" y2="14"></line><line x1="22" x2="16" y1="11" y2="11"></line></svg>
                          )}
                          {req.type === 'Transfer Voucher' && (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 17V3"></path><path d="m6 11 6 6 6-6"></path><path d="M19 21H5"></path></svg>
                          )}
                        </div>
                        <strong>{req.type}</strong>
                        <p>{req.title}</p>
                      </article>
                    ))}
                  </div>

                  <div className="requests-bottom-grid">
                    <div className="request-form-area">
                      <h3>
                        {isPenaltyType
                          ? '1. PR Penalty — Customer Details'
                          : isNameChangeType
                          ? '2. Name Change — Customer Details'
                          : isNewConnectionType
                          ? '3. New Connection — Customer Details'
                          : '4. Transfer Voucher — Customer Details'}
                      </h3>
                      <p className="form-info">Pending requests on the right are clickable. Only payment fields are editable.</p>
                      {cashierPenaltyError ? <div className="error-box">{cashierPenaltyError}</div> : null}

                      <form className="request-form">
                        <div className="form-row">
                          <div className="form-field">
                            <label>{isTransferVoucherType ? 'New Name' : 'Customer Name'}</label>
                            <input
                              type="text"
                              value={cashierFormCustomerName}
                              onChange={(event) => setCashierFormCustomerName(event.target.value)}
                              placeholder="e.g. Anita Sharma"
                              readOnly={!!selectedCashierRequest}
                            />
                          </div>
                          <div className="form-field">
                            <label>Consumer Number</label>
                            <input
                              type="text"
                              value={cashierFormConsumerNumber}
                              onChange={(event) => setCashierFormConsumerNumber(event.target.value)}
                              placeholder="DOM-XXXXXXX"
                              readOnly={!!selectedCashierRequest}
                            />
                          </div>
                        </div>

                        <div className="form-row">
                          <div className="form-field">
                            <label>{isTransferVoucherType ? 'New Mobile Number' : 'Mobile Number'}</label>
                            <input
                              type="tel"
                              value={cashierFormMobileNumber}
                              onChange={(event) => setCashierFormMobileNumber(event.target.value)}
                              placeholder="+91 9XXXXXXXXX"
                              readOnly={!!selectedCashierRequest}
                            />
                          </div>
                          <div className="form-field">
                            <label>{isTransferVoucherType ? 'Existing Holder Name' : 'Connection ID / SV No.'}</label>
                            <input
                              type="text"
                              value={cashierFormConnectionIdOrHolder}
                              onChange={(event) => setCashierFormConnectionIdOrHolder(event.target.value)}
                              placeholder="SV-2824-XXXX"
                              readOnly={!!selectedCashierRequest}
                            />
                          </div>
                        </div>

                        <div className="form-field">
                          <label>{isTransferVoucherType ? 'New Address' : 'Address'}</label>
                          <input
                            type="text"
                            value={cashierFormAddress}
                            onChange={(event) => setCashierFormAddress(event.target.value)}
                            placeholder="House no, street, area, city, PIN"
                            readOnly={!!selectedCashierRequest}
                          />
                        </div>

                        {isNewConnectionType ? (
                          <div className="form-field">
                            <label>Products</label>
                            <input
                              type="text"
                              value={selectedNewConnectionRequest?.productDetails || ''}
                              placeholder="Requested products will appear here"
                              readOnly
                            />
                          </div>
                        ) : null}

                        {isNameChangeType ? (
                          <div className="form-row">
                            <div className="form-field">
                              <label>Old Name (as on record)</label>
                              <input
                                type="text"
                                value={cashierFormOldName}
                                onChange={(event) => setCashierFormOldName(event.target.value)}
                                readOnly={!!selectedCashierRequest}
                              />
                            </div>
                            <div className="form-field">
                              <label>New Name (as requested)</label>
                              <input
                                type="text"
                                value={cashierFormNewName}
                                onChange={(event) => setCashierFormNewName(event.target.value)}
                                readOnly={!!selectedCashierRequest}
                              />
                            </div>
                          </div>
                        ) : null}

                        {isTransferVoucherType ? (
                          <>
                            <div className="form-field">
                              <label>Type of Connection Transfer</label>
                              <div className="radio-group">
                                <label className="radio-option">
                                  <input
                                    type="radio"
                                    name="transfer-type"
                                    value="INTRA_STATE"
                                    checked={transferVoucherStateType === 'INTRA_STATE'}
                                    onChange={(e) => setTransferVoucherStateType(e.target.value)}
                                  />
                                  <span>Intra State</span>
                                </label>
                                <label className="radio-option">
                                  <input
                                    type="radio"
                                    name="transfer-type"
                                    value="INTER_STATE"
                                    checked={transferVoucherStateType === 'INTER_STATE'}
                                    onChange={(e) => setTransferVoucherStateType(e.target.value)}
                                  />
                                  <span>Inter State</span>
                                </label>
                              </div>
                            </div>

                            <div className="form-row">
                              <div className="form-field">
                                <label>From State</label>
                                <input
                                  type="text"
                                  value={transferVoucherFromState}
                                  onChange={(e) => setTransferVoucherFromState(e.target.value)}
                                  placeholder="e.g., Maharashtra"
                                />
                              </div>
                              <div className="form-field">
                                <label>To State</label>
                                <input
                                  type="text"
                                  value={transferVoucherToState}
                                  onChange={(e) => setTransferVoucherToState(e.target.value)}
                                  placeholder="e.g., Karnataka"
                                />
                              </div>
                            </div>
                          </>
                        ) : null}

                        <div className="form-row">
                          <div className="form-field">
                            <label>{isTransferVoucherType ? 'Transfer Voucher Amount' : isNewConnectionType ? 'Total Amount' : 'Charge Amount'}</label>
                            <input
                              type="number"
                              value={cashierFormAmount}
                              onChange={(event) => setCashierFormAmount(event.target.value)}
                              readOnly={!!selectedCashierRequest}
                            />
                          </div>
                          <div className="form-field">
                            <label>Payment Mode</label>
                            <select value={requestPaymentMode} onChange={(event) => setRequestPaymentMode(event.target.value)}>
                              <option value="CASH">Cash</option>
                              <option value="UPI">UPI</option>
                              <option value="CARD">Card</option>
                              <option value="BANK_TRANSFER">Bank Transfer</option>
                            </select>
                          </div>
                        </div>

                        <div className="form-field">
                          <label>Bank Transfer ID / UTR</label>
                          <input
                            type="text"
                            value={requestPaymentId}
                            onChange={(event) => setRequestPaymentId(event.target.value)}
                            placeholder="UTR / Txn ID (required for non-cash)"
                          />
                        </div>

                        <div className="form-field">
                          <label>Remarks</label>
                          <textarea
                            value={requestRemarks}
                            onChange={(event) => setRequestRemarks(event.target.value)}
                            placeholder="Optional notes for audit trail..."
                          ></textarea>
                        </div>

                        <div className="form-actions row-actions">
                          <button
                            type="button"
                            className="submit-btn"
                            onClick={handleSubmitPenaltyRequest}
                            disabled={requestSubmitting || !selectedCashierRequest || selectedCashierRequest.status !== 'PENDING'}
                          >
                            {requestSubmitting ? 'Submitting...' : '✓ Submit & Generate Receipt'}
                          </button>
                          <button type="button" className="reset-btn" onClick={handleResetPenaltyRequestForm} disabled={false}>Reset</button>
                        </div>
                      </form>
                    </div>

                    <aside className="recent-requests-panel">
                      <h3>Recent Requests</h3>
                      <p className="section-date">Today</p>

                      <div className="customer-search-wrapper">
                        <input
                          type="text"
                          className="customer-search-input"
                          value={cashierRequestCustomerSearchQuery}
                          onChange={(e) => handleCashierRequestCustomerSearch(e.target.value)}
                          placeholder={`Search customer by name for ${activeCashierRequestType}...`}
                        />
                        {cashierRequestCustomerSearchQuery && cashierRequestCustomerResults.length > 0 && (
                          <div className="customer-search-results">
                            {cashierRequestCustomerResults.map((customer) => (
                              <button
                                key={customer.id}
                                type="button"
                                className="customer-result-item"
                                onClick={() => handleSelectCashierRequestCustomer(customer)}
                              >
                                <div className="customer-result-name">{customer.name}</div>
                                <div className="customer-result-meta">
                                  {customer.consumer_number && <span>#{customer.consumer_number}</span>}
                                  {customer.phone && <span>{customer.phone}</span>}
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {activeCashierRequestsLoading ? <p>Loading requests...</p> : null}
                      {!activeCashierRequestsLoading && !activeCashierRequests.length ? <p>No requests found.</p> : null}

                      <div className="recent-list">
                        {activeCashierRequests.map((request) => {
                          const isPending = request.status === 'PENDING';
                          const isSelected =
                            isPenaltyType
                              ? Number(selectedPenaltyRequestId) === Number(request.id)
                              : isNameChangeType
                              ? Number(selectedNameChangeRequestId) === Number(request.id)
                              : isNewConnectionType
                              ? Number(selectedNewConnectionRequestId) === Number(request.id)
                              : Number(selectedTransferVoucherRequestId) === Number(request.id);

                          return (
                            <button
                              key={request.id}
                              type="button"
                              className={`recent-item ${isSelected ? 'is-selected' : ''} ${isPending ? 'is-clickable' : 'is-locked'}`}
                              onClick={() => handleSelectPenaltyRequest(request)}
                              disabled={!isPending}
                            >
                              <div className="request-info">
                                <p>{request.customerName}</p>
                                <small>{activeCashierRequestType}</small>
                              </div>

                              <div className="request-status">
                                <span className={`status-badge ${isPending ? 'pending' : 'approved'}`}>
                                  {request.status.toLowerCase()}
                                </span>
                                <span className="amount">₹{Number(request.amount || 0).toLocaleString('en-IN')}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </aside>
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
