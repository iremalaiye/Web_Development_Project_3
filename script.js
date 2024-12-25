document.addEventListener("DOMContentLoaded", function () {
            const homePage = document.getElementById("default");
            homePage.classList.add("active");
        });
		
//for showing relating section
function showSection(sectionId) {
    const sections = document.querySelectorAll("section");
    sections.forEach(section => {
        section.style.display = "none";
    });
    document.getElementById(sectionId).style.display = "block";
}



//SECTION 1 : SUPPLIER MANAGEMENT MODULE
let farmers = [];
//1.1. FARMER'S INFORMATION

//get farmer information
document.getElementById('farmer-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const farmerId = document.getElementById('farmer-id').value;
    const farmerName = document.getElementById('farmer-name').value;
    const contact = document.getElementById('contact').value;
    const location = document.getElementById('location').value;

    
    const existingFarmerIndex = farmers.findIndex(farmer => farmer.id === farmerId);
//add and update
    if (existingFarmerIndex === -1) { //If the farmer does not exist, a new farmer is added. //ADD
        
        farmers.push({ id: farmerId, name: farmerName, contact, location });
    } else {
        
        farmers[existingFarmerIndex] = { id: farmerId, name: farmerName, contact, location };//If the farmer already exists,update // UPDATE
    }
	
	if (!farmerId) {
		alert('Farmer ID is required.');
		return; 
	}

	  
		displayFarmers();
	console.log(farmers);
   
    this.reset();
});


//display farmers in 'Farmers List table'
function displayFarmers(filteredFarmers = farmers) {
    const farmersList = document.getElementById('farmers-list');
    if (!farmersList) {
        console.error('farmers-list element not found!');
        return;  
    }

    const farmersTableBody = farmersList.getElementsByTagName('tbody')[0];
    farmersTableBody.innerHTML = ''; 

    filteredFarmers.forEach(farmer => {
       
        const row = farmersTableBody.insertRow();
        row.innerHTML = `
            <td>${farmer.id}</td>
            <td>${farmer.name}</td>
            <td>${farmer.contact}</td>
            <td>${farmer.location}</td>
            <td><button onclick="deleteFarmer('${farmer.id}')">Delete</button></td>
        `;
    });
}


//search farmer
document.getElementById('farmer-search-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const searchQuery = document.getElementById('farmer-search').value.toLowerCase();
    const filteredFarmers = farmers.filter(farmer => {
        return farmer.name.toLowerCase().includes(searchQuery) || 
               farmer.location.toLowerCase().includes(searchQuery);
    });

    displayFarmers(filteredFarmers); 
});

//delete farmer

function deleteFarmer(farmerId) {
   
    farmers = farmers.filter(farmer => farmer.id !== farmerId);
    purchaseRecords = purchaseRecords.filter(record => record.farmerId !== farmerId);

    
    displayFarmers();
    displayPurchase();
	displayUnpackedProducts();
	updateProductDropdown(); 
}

//1.1. FARMER'S INFORMATION FINISHED

//1.2. PURCHASE RECORDS

let purchaseRecords = [];

//getting purchase information
document.getElementById('purchase-form').addEventListener('submit', function(event) {
    event.preventDefault(); 

    const purchaseId = document.getElementById('purchase-id').value;
    const farmerId = document.getElementById('farmer-id-purchase').value;
    const purchaseDate = document.getElementById('purchase-date').value;
    const productType = document.getElementById('product-type').value;
    const quantityPurchased = parseInt(document.getElementById('quantity-purchased').value, 10);
    const pricePerKg = parseFloat(document.getElementById('price-per-kg').value);
    

    const farmerExists = farmers.some(farmer => farmer.id === farmerId); 

    if (!farmerExists) {
        alert("This Farmer ID does not exist. Please add the farmer first.");
        return; 
    }
	
	
	
	 const existingPurchase = purchaseRecords.some(record => record.purchaseId === purchaseId); 

    if (existingPurchase) {
        alert("This Purchase ID already exists. Please use a unique Purchase ID.");
        return; 
    }

    const totalCost = quantityPurchased * pricePerKg;


    purchaseRecords.push({
        purchaseId,
        farmerId,
        purchaseDate,
        productType,
        quantityPurchased,
        totalCost
    });
	displayUnpackedProducts()
    displayPurchase();

    updateProductDropdown();
});

function displayPurchase() {
    const tableBody = document.getElementById('purchase-list').getElementsByTagName('tbody')[0];
    
    tableBody.innerHTML = '';

    purchaseRecords.forEach(record => {
        const newRow = tableBody.insertRow();
        newRow.innerHTML = `
            <td>${record.purchaseId}</td>
            <td>${record.farmerId}</td>
            <td>${record.purchaseDate}</td>
            <td>${record.productType}</td>
            <td>${record.quantityPurchased}</td>
            <td>${(record.totalCost / record.quantityPurchased).toFixed(2)}</td> <!-- pricePerKg -->
            <td>${record.totalCost.toFixed(2)}</td>
        `;
    });
}

//sort purchases
function sortPurchaseRecords(criteria) {
    const sortedRecords = [...purchaseRecords]; 
    
    if (criteria === 'date') {
        sortedRecords.sort((a, b) => new Date(a.purchaseDate) - new Date(b.purchaseDate));
    } else if (criteria === 'farmer') {
        sortedRecords.sort((a, b) => a.farmerId - b.farmerId); 
    } else if (criteria === 'amount') {
        sortedRecords.sort((a, b) => b.totalCost - a.totalCost); 
    } 
    displaySortedPurchases(sortedRecords); 
}

function displaySortedPurchases(records) {
    const tableBody = document.getElementById('sorted-purchase-list').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; 

    records.forEach(record => {
        const row = tableBody.insertRow();
        row.innerHTML = `
            <td>${record.purchaseId}</td>
            <td>${record.farmerId}</td>
            <td>${record.purchaseDate}</td>
            <td>${record.productType}</td>
            <td>${record.quantityPurchased}</td>
            <td>${record.totalCost.toFixed(2)}</td>
        `;
    });
}



//Purchase Summary For Farmer
document.getElementById('farmer-summary-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const selectedFarmerId = document.getElementById('farmer-summary-id').value;

  
    const farmerPurchases = purchaseRecords.filter(record => record.farmerId === selectedFarmerId);

    if (farmerPurchases.length === 0) {
        alert("No purchase records found for this farmer.");
        return;
    }

    const totalQuantity = farmerPurchases.reduce((sum, record) => sum + record.quantityPurchased, 0);
    const totalCost = farmerPurchases.reduce((sum, record) => sum + record.totalCost, 0);

   
    document.getElementById('summary-total-quantity').textContent = `Total Quantity: ${totalQuantity} kg`;
    document.getElementById('summary-total-cost').textContent = `Total Cost: $${totalCost.toFixed(2)}`;

    
    const summaryTableBody = document.getElementById('farmer-summary-list').getElementsByTagName('tbody')[0];
    summaryTableBody.innerHTML = '';

    farmerPurchases.forEach(record => {
        const row = summaryTableBody.insertRow();
        row.innerHTML = `
            <td>${record.purchaseId}</td>
            <td>${record.purchaseDate}</td>
            <td>${record.productType}</td>
            <td>${record.quantityPurchased} kg</td>
            <td>$${record.totalCost.toFixed(2)}</td>
        `;
    });
});


// Purchase Summary For Time Period
document.getElementById('time-period-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const startDateInput = document.getElementById('start-date').value;
    const endDateInput = document.getElementById('end-date').value;

    if (!startDateInput || !endDateInput) {
        alert('Please select both start and end dates.');
        return;
    }

    const startDate = new Date(startDateInput);
    const endDate = new Date(endDateInput);

    let filteredPurchases = purchaseRecords.filter(purchase => {
        const purchaseDate = new Date(purchase.purchaseDate);
        return purchaseDate >= startDate && purchaseDate <= endDate;
    });

    if (filteredPurchases.length === 0) {
        alert('No purchase records found for the selected date range.');
        return;
    }

   
    const totalQuantity = filteredPurchases.reduce((sum, record) => sum + record.quantityPurchased, 0);
    const totalCost = filteredPurchases.reduce((sum, record) => sum + record.totalCost, 0);

   
    document.getElementById('period-total-quantity').textContent = `Total Quantity: ${totalQuantity} kg`;
    document.getElementById('period-total-cost').textContent = `Total Cost: $${totalCost.toFixed(2)}`;

    
    const summaryTableBody = document.getElementById('time-period-summary-list').getElementsByTagName('tbody')[0];
    summaryTableBody.innerHTML = ''; 

    filteredPurchases.forEach(record => {
        const row = summaryTableBody.insertRow();
        row.innerHTML = `
            <td>${record.purchaseId}</td>
            <td>${record.farmerId}</td>
            <td>${record.purchaseDate}</td>
            <td>${record.productType}</td>
            <td>${record.quantityPurchased} kg</td>
            <td>$${record.totalCost.toFixed(2)}</td>
        `;
    });
});


//1.2. PURCHASE RECORDS FINISHED


// 1.3. EXPENSE CALCULATION
//expense calculation
document.getElementById('expense-form').addEventListener('submit', function(event) {
            event.preventDefault();

            const startDate = document.getElementById('start-date').value; 
            const endDate = document.getElementById('end-date').value; 

            if (!startDate || !endDate) {
                alert("Please select both start and end dates.");
                return;
            }

            const start = new Date(startDate);
            const end = new Date(endDate);

          

            
            const filteredPurchases = purchaseRecords.filter(purchase => {
                const purchaseDate = new Date(purchase.purchaseDate);
                return purchaseDate >= start && purchaseDate <= end;
            });

          
            const totalExpenses = filteredPurchases.reduce((sum, purchase) => sum + purchase.totalCost, 0);
            document.getElementById('total-expenses').textContent = `$${totalExpenses.toFixed(2)}`;
        });


//raw material cost
document.getElementById('raw-material-report-form').addEventListener('submit', function(event) {
    event.preventDefault();

   
    const materialCosts = {};

    purchaseRecords.forEach(record => {
        const { productType, totalCost } = record;

      
        if (materialCosts[productType]) {
            materialCosts[productType] += totalCost;
        } else {
            materialCosts[productType] = totalCost;
        }
    });

    const reportTableBody = document.getElementById('raw-material-report-list').getElementsByTagName('tbody')[0];
    reportTableBody.innerHTML = ''; 

   
    for (const productType in materialCosts) {
        const totalCost = materialCosts[productType];
        
        const row = reportTableBody.insertRow();
        row.innerHTML = `
            <td>${productType}</td>
            <td>$${totalCost.toFixed(2)}</td>
        `;
    }
});



// 1.3. EXPENSE CALCULATION FINISHED
 
//SECTION 1 : SUPPLIER MANAGEMENT MODULE FINISHED



//SECTION 2 PRODUCT CATEGORİZATION AND PACKAGING MODULE


//2.1. PRODUCT CATEGORIES

//product name and quantity dropdown
function updateProductDropdown() {
    const productNameDropdown = document.getElementById('product-name');
    
    const productQuantities = {};

 
    for (const record of purchaseRecords) {
        const { productType, quantityPurchased } = record;

      
        if (productQuantities[productType]) {
            productQuantities[productType] += quantityPurchased;
        } else {
            productQuantities[productType] = quantityPurchased;
        }
    }


    productNameDropdown.innerHTML = '';

  
    for (const productType in productQuantities) {
        const quantity = productQuantities[productType];

        const newOption = document.createElement('option');
        newOption.value = productType;
        newOption.textContent = `${productType} (${quantity} kg)`;
        newOption.dataset.quantity = quantity.toString();
        productNameDropdown.appendChild(newOption);
    }
}


document.getElementById('product-name').addEventListener('change', function() {
    const selectedOption = this.options[this.selectedIndex];
    const quantity = selectedOption.dataset.quantity;

    if (quantity) {
        document.getElementById('product-details').textContent = `${selectedOption.value} - Available Quantity: ${quantity} kg`;
    } else {
        document.getElementById('product-details').textContent = "Select a product to view its details.";
    }
});


let inventoryList = [];

function getProductTotalPurchased(productName) {
    return purchaseRecords
        .filter(record => record.productType === productName)
        .reduce((total, record) => total + record.quantityPurchased, 0);
}
//getting product categorization information
document.getElementById('category-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const productNameElement = document.getElementById('product-name');
    const productName = productNameElement.value;
    const selectedOption = productNameElement.options[productNameElement.selectedIndex];
    const availableQuantity = getProductTotalPurchased(productName); 

    const packagingQuantity = parseFloat(document.getElementById('quantity').value);
    const category = document.getElementById('category').value;

    if (!productName) {
        alert("Please choose a product");
        return;
    }

    if (!packagingQuantity || packagingQuantity <= 0) {
        alert("Enter a valid packaging quantity");
        return;
    }

    const rows = document.querySelectorAll(`#category-list tbody tr[data-product="${productName}"]`);
    let totalPackagingQuantity = 0;

    rows.forEach(row => {
        totalPackagingQuantity += parseFloat(row.dataset.packagingQuantity);
    });


//exceed package situation
    if (totalPackagingQuantity + packagingQuantity > availableQuantity) {
        alert(
            `Error: The total packaging quantity of product ${productName} (${totalPackagingQuantity + packagingQuantity} kg) cannot exceed the available quantity (${availableQuantity} kg).`
        );
        return;
    }

//package 
    let packagingQuantityInGrams = packagingQuantity * 1000; 
    let totalPackages = 0;
    let packageWeightInGrams = 0;

    if (category === 'small') {
        packageWeightInGrams = 100;
    } else if (category === 'medium') {
        packageWeightInGrams = 250;
    } else if (category === 'large') {
        packageWeightInGrams = 500;
    } else if (category === 'extra-large') {
        packageWeightInGrams = 1000;
    } else if (category === 'family-pack') {
        packageWeightInGrams = 2000;
    } else if (category === 'bulk-pack') {
        packageWeightInGrams = 5000;
    }else if (category === 'premium') {
        const customPackageWeight = parseFloat(prompt("Enter the package weight for Premium category (in kg):"));
        if (isNaN(customPackageWeight) || customPackageWeight <= 0) {
            alert("Please enter a valid weight for the Premium category.");
            return;
        }
        packageWeightInGrams = customPackageWeight * 1000; 
    }

    totalPackages = Math.floor(packagingQuantityInGrams / packageWeightInGrams); 
    const packedWeight = totalPackages * packageWeightInGrams / 1000; 
    const leftoverQuantity = packagingQuantity - packedWeight; 

    if (leftoverQuantity > 0) {
        alert(
            `Note: ${leftoverQuantity.toFixed(2)} kg could not be packaged into ${category} and will remain in stock.`
        );
    }

    const tableBody = document.querySelector('#category-list tbody');
    const newRow = document.createElement('tr');
    newRow.dataset.product = productName;
    newRow.dataset.packagingQuantity = packedWeight;

//product categories table
    newRow.innerHTML = `
        <td>${productName}</td>
        <td>${category}</td>
        <td>${packedWeight} kg</td>
        <td>${totalPackages} packet</td>
    `;

    tableBody.appendChild(newRow);

    alert("Packaging information added successfully.");
    document.getElementById('category-form').reset();

    updatePurchaseRecords(productName, packedWeight); 

    // Add products and packages to inventoryList
    let existingProduct = inventoryList.find(item => item.productName === productName && item.category === category);

    if (existingProduct) {
        existingProduct.totalPackages += totalPackages;
    } else {
        inventoryList.push({
            productName,
            category,
            totalPackages
        });
    }

    console.log(inventoryList);

    updateInventoryTable();
    updateMarketTable();
    displayUnpackedProducts();
	checkStockLevels(); 
});

// Update purchase records after packaging
function updatePurchaseRecords(productName, packedWeight) {
    for (const record of purchaseRecords) {
        if (record.productType === productName) {
            record.quantityPurchased -= packedWeight; 
            break;
        }
    }
}


//2.3. Inventory Tracking

const minimumStockLevels = {
    'small': 50,  
    'medium': 50, 
    'large': 50,  
    'premium': 20, 
	'extra-large':20,
	'family-pack':20,
	'bulk-pack':20,
	
};


function checkStockLevels() {
    inventoryList.forEach(item => {
        const minStock = minimumStockLevels[item.category];
        if (item.totalPackages < minStock) {
            alert(`Warning: Stock for ${item.productName} in ${item.category} category is low. Only ${item.totalPackages} packages left!`);
        }
    });
}


//3. Sales Management Module
//update market
function updateMarketTable() {
    const marketTableBody = document.querySelector('#market-table-body');
    const productsSelect = document.querySelector('#products');
    marketTableBody.innerHTML = ''; 
    productsSelect.innerHTML = ''; 


    inventoryList.forEach(item => {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${item.productName} (${item.category})</td>
            <td>${item.category}</td>
            <td>${item.totalPackages}</td>
        `;
        marketTableBody.appendChild(newRow);

       
        const option = document.createElement('option');
        option.value = `${item.productName} - ${item.category}`; // Ürün adı ve kategori adı birleştirilir
        option.textContent = `${item.productName} (${item.category}) - ${item.totalPackages} packages available`;
        productsSelect.appendChild(option);
    });
}


//2.2. Pricing Structure
const pricingStructure = {
    "small": 5, 
    "medium": 4.5, 
    "large": 4, 
    "extra-large": 3.8, 
    "family-pack": 3.5, 
    "bulk-pack": 3 ,
	 "premium" :10,
};

function updatePricingTable() {
    const pricingTableBody = document.getElementById('pricing-table-body');
    pricingTableBody.innerHTML = ''; 

    
    for (const category in pricingStructure) {
        const price = pricingStructure[category];

        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${category}</td>
            <td>$${price.toFixed(2)}</td>
        `;
        pricingTableBody.appendChild(newRow); 
    }
}


updatePricingTable();



let orderHistory = [];

// Getting order management information
document.querySelector('#order-form').addEventListener('submit', function(event) {
    event.preventDefault(); 

    const productNameAndCategory = document.querySelector('#products').value;
    const [productName, category] = productNameAndCategory.split(' - '); 
    const numberOfPackage = parseInt(document.querySelector('#number-of-package').value);
    const customerName = document.querySelector('#customer-name').value;
    const customerContact = document.querySelector('#customer-contact').value;
    const shippingInfo = document.querySelector('#shipping-info').value;
    const customerId = document.querySelector('#customer-id').value; 

    const selectedProduct = inventoryList.find(item => item.productName === productName && item.category === category); 

    if (numberOfPackage > selectedProduct.totalPackages) {
        alert(`You cannot order more than ${selectedProduct.totalPackages} packages of ${category}.`);
        return;
    }

    selectedProduct.totalPackages -= numberOfPackage;

    const unitPrice = pricingStructure[category.toLowerCase()] || 0; 

    if (unitPrice === 0) {
        alert("Invalid category selected.");
        return;
    }

    const totalPrice = unitPrice * numberOfPackage;

    // Adding the order to the history
    orderHistory.push({
        customerId,
        customerName,
        productName,
        category,
        numberOfPackage,
        remainingPackages: selectedProduct.totalPackages,
        totalPrice: totalPrice.toFixed(2),
        orderStatus: "Pending",
    });

    // Order history table
    const orderHistoryTableBody = document.querySelector('#order-history tbody');
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${customerId}</td>
        <td>${customerName}</td>
        <td>${productName} - ${category}</td>
        <td>${numberOfPackage}</td>
        <td>${selectedProduct.totalPackages}</td>
        <td>${totalPrice.toFixed(2)} USD</td>
        <td>
            <select class="order-status" data-index="${orderHistory.length - 1}">
                <option value="Pending" selected>Pending</option>
                <option value="Processed">Processed</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
            </select>
        </td>
    `;
    orderHistoryTableBody.appendChild(newRow);

    updateMarketTable();
    updateInventoryTable();
    updateRevenueTable(category, numberOfPackage, unitPrice);

    document.querySelector('#order-form').reset();
});

// Update order status in the table and history
document.querySelector('#order-history').addEventListener('change', function(event) {
    if (event.target && event.target.classList.contains('order-status')) {
        const orderIndex = event.target.dataset.index;
        const newStatus = event.target.value;

        // Update the order status in the orderHistory array
        if (orderHistory[orderIndex]) {
            orderHistory[orderIndex].orderStatus = newStatus;
        }
    }
});

updateMarketTable();
updateInventoryTable();





//filter orders

document.querySelector('#filter-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const statusFilter = document.querySelector('#filter-status').value;
    const customerFilter = document.querySelector('#filter-customer').value.toLowerCase();
    const categoryFilter = document.querySelector('#filter-category').value.toLowerCase();


    const filteredOrders = orderHistory.filter(order => {
        const matchesStatus = !statusFilter || order.orderStatus === statusFilter;
        const matchesCustomer = !customerFilter || order.customerName.toLowerCase().includes(customerFilter);
        const matchesCategory = !categoryFilter || order.category.toLowerCase().includes(categoryFilter);
        return matchesStatus && matchesCustomer && matchesCategory;
    });

    
    const filteredOrdersTableBody = document.querySelector('#filtered-orders tbody');
    filteredOrdersTableBody.innerHTML = ''; // Mevcut satırları temizle

    filteredOrders.forEach(order => {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${order.customerId}</td>
            <td>${order.customerName}</td>
            <td>${order.productName} - ${order.category}</td>
            <td>${order.numberOfPackage}</td>
            <td>${order.remainingPackages}</td>
            <td>${order.totalPrice} USD</td>
            <td>${order.orderStatus}</td>
        `;
        filteredOrdersTableBody.appendChild(newRow);
    });
});


//sales Report

//1. Sales Reports by Product Category
function generateSalesReports() {
    const report = {
        unitsSold: {},
        revenuePerCategory: {},
        overallRevenue: 0,
    };

    
    orderHistory.forEach(order => {
        const { category, numberOfPackage, totalPrice } = order;

        
        if (!report.unitsSold[category]) {
            report.unitsSold[category] = 0;
        }
        report.unitsSold[category] += numberOfPackage;

        
        if (!report.revenuePerCategory[category]) {
            report.revenuePerCategory[category] = 0;
        }
        report.revenuePerCategory[category] += parseFloat(totalPrice);

      
        report.overallRevenue += parseFloat(totalPrice);
    });

    return report;
}


	
//draw
function renderSalesChart(report) {
    const ctx = document.getElementById('salesChart').getContext('2d');

    const categories = Object.keys(report.unitsSold);
    const unitsSoldData = Object.values(report.unitsSold);
    const revenueData = Object.values(report.revenuePerCategory);

    new Chart(ctx, {
        type: 'bar', 
        data: {
            labels: categories,
            datasets: [
                {
                    label: 'Units Sold',
                    data: unitsSoldData,
                    backgroundColor: 'rgba(54, 162, 235, 0.6)', 
                },
                {
                    label: 'Revenue (USD)',
                    data: revenueData,
                    backgroundColor: 'rgba(255, 99, 132, 0.6)', 
                },
            ],
        },
        options: {
            responsive: true,

            scales: {
                y: {
                    beginAtZero: true, 
                },
            },
        },
    });
}

document.querySelector('#draw-chart').addEventListener('click', () => {
    const report = generateSalesReports(); 
    renderSalesChart(report); 
});


//csv
function exportToCSV(report) {
    let csvContent = "Category,Units Sold,Revenue (USD)\n";

   
    Object.keys(report.unitsSold).forEach(category => {
        csvContent += `${category},${report.unitsSold[category]},${report.revenuePerCategory[category].toFixed(2)}\n`;
    });

    csvContent += `Overall,,${report.overallRevenue.toFixed(2)}\n`;

   
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sales_report.csv';
    a.click();
}


document.querySelector('#export-csv').addEventListener('click', () => {
    const report = generateSalesReports(); 
    exportToCSV(report); 
});






//revenue
function updateRevenueTable(category, numberOfPackage, unitPrice) {
    
    const revenueTableBody = document.querySelector('#revenue-table tbody');
    const existingRow = Array.from(revenueTableBody.rows).find(row => row.cells[0].textContent === category);

    if (existingRow) {
      
        const quantitySoldCell = existingRow.cells[1];
        const quantitySold = parseInt(quantitySoldCell.textContent) + numberOfPackage;
        quantitySoldCell.textContent = quantitySold;

        const totalRevenueCell = existingRow.cells[3];
        const totalRevenue = quantitySold * unitPrice;
        totalRevenueCell.textContent = totalRevenue.toFixed(2) + " USD";
    } else {
       
        const newRow = document.createElement('tr');
        const totalRevenue = numberOfPackage * unitPrice;

        newRow.innerHTML = `
            <td>${category}</td>
            <td>${numberOfPackage}</td>
            <td>${unitPrice.toFixed(2)} USD</td>
            <td>${totalRevenue.toFixed(2)} USD</td>
        `;
        revenueTableBody.appendChild(newRow);
    }
}







//4. Financial Analysis Module

document.addEventListener('DOMContentLoaded', function() {
    
    function updateFinancialAnalysis() {
        console.log(purchaseRecords);
        console.log(orderHistory);
        
        // Calculate total expenses (from purchaseRecords list)
        let totalExpenses = purchaseRecords.reduce((acc, record) => {
            return acc + record.totalCost;
        }, 0);

        // Calculate total income (from orderHistory list)
        let totalIncome = orderHistory.reduce((acc, record) => {
            return acc + parseFloat(record.totalPrice);
        }, 0);

        // Tax calculation 
        let taxRate = 0.10;
        let tax = totalIncome * taxRate;

        // Net profit calculation
        let netProfit = totalIncome - totalExpenses - tax;

      
        const tbody = document.querySelector('#financial-analysis-table tbody');

    
        tbody.innerHTML = '';

        
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${totalIncome.toFixed(2)} USD</td>
            <td>${totalExpenses.toFixed(2)} USD</td>
            <td>${netProfit.toFixed(2)} USD</td>
        `;

      
        tbody.appendChild(newRow);
		 document.getElementById('tax-summary').textContent = `Total Tax: ${tax.toFixed(2)} USD`;
    }


    const updateButton = document.getElementById('update-financial-analysis');
    updateButton.addEventListener('click', function() {
        updateFinancialAnalysis(); 
    });

    
    updateFinancialAnalysis();
});



//5. Inventory Management Module


function displayUnpackedProducts() {
    const unpackedTableBody = document.getElementById('inventory-unpacked').getElementsByTagName('tbody')[0];

    
    unpackedTableBody.innerHTML = '';

  
    const productTotals = {};

    purchaseRecords.forEach(purchase => {
        if (!productTotals[purchase.productType]) {
            productTotals[purchase.productType] = 0;
        }
        productTotals[purchase.productType] += purchase.quantityPurchased;
    });

  
    for (const productType in productTotals) {
        const totalAmount = productTotals[productType];
        
        const newRow = unpackedTableBody.insertRow();
        newRow.innerHTML = `
            <td>${productType}</td>
            <td>${totalAmount}</td>
        `;
    }
}
function updateInventoryTable() {
    const inventoryTableBody = document.querySelector('#inventory tbody');
    inventoryTableBody.innerHTML = ''; 

 
    inventoryList.forEach(item => {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${item.productName}</td>
            <td>${item.category}</td>
            <td>${item.totalPackages}</td>
        `;
        inventoryTableBody.appendChild(newRow);
    });
}



//6. Comprehensive Report Generation Module

document.addEventListener('DOMContentLoaded', function() {
 
    function generateComprehensiveReport() {
        // Calculate total expenses (from purchaseRecords list)
        let totalExpenses = purchaseRecords.reduce((acc, record) => {
            return acc + record.totalCost;
        }, 0);

        // Calculate total income (from orderHistory list)
        let totalIncome = orderHistory.reduce((acc, record) => {
            return acc + parseFloat(record.totalPrice);
        }, 0);

        // Tax calculation 
        let taxRate = 0.10;
        let tax = totalIncome * taxRate;

        // Net profit calculation
        let netProfit = totalIncome - totalExpenses - tax;
		
		
		 // Calculate products sold and remaining stock per category
        let categoryData = {}; 
        orderHistory.forEach(order => {
            const { category, numberOfPackage, remainingPackages } = order;
            if (!categoryData[category]) {
                categoryData[category] = { sold: 0, remaining: 0 };
            }
            categoryData[category].sold += numberOfPackage; 
            categoryData[category].remaining = remainingPackages; 
        });

		 //add remanings even if is not sold
        inventoryList.forEach(item => {
            const { category, totalPackages } = item;
            if (!categoryData[category]) {
                categoryData[category] = { sold: 0, remaining: 0 };
            }
           
            categoryData[category].remaining = totalPackages;
        });

        const tbody = document.querySelector('#comprehensive-report-table tbody');

        
        tbody.innerHTML = '';

 
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${totalIncome.toFixed(2)} USD</td>
            <td>${totalExpenses.toFixed(2)} USD</td>
            <td>${tax.toFixed(2)} USD</td>
            <td>${netProfit.toFixed(2)} USD</td>
           <td>
                ${Object.entries(categoryData).map(([category, data]) => 
                    `<div>${category}: ${data.sold} packages</div>`
                ).join('')}
            </td>
            <td>
                ${Object.entries(categoryData).map(([category, data]) => 
                    `<div>${category}: ${data.remaining} packages</div>`
                ).join('')}
            </td>
        `;

     
        tbody.appendChild(newRow);
    }


    const generateReportButton = document.getElementById('generate-report');
    generateReportButton.addEventListener('click', function() {
        generateComprehensiveReport(); 
    });

  
    generateComprehensiveReport();
});
