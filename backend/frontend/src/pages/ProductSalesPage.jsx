import React, { useState, useEffect } from "react";
import { FixedSizeList as List } from "react-window";
import { Paper, Typography, Box } from "@mui/material";
import { Bar } from "react-chartjs-2";
import ChartJS from "chart.js/auto";  // Auto imports the necessary chart components
import API from "../services/api";

const ProductSalesPage = () => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSalesData();
  }, []);

  const fetchSalesData = async () => {
    try {
      const response = await API.get("/sales/products");
      setSalesData(response.data.sales || []);
      setLoading(false);
    } catch (error) {
      setError(error.response?.data || "Error fetching sales data");
      setLoading(false);
    }
  };

  // Chart data for all products
  const chartData = {
    labels: salesData.map(item => item.productName),  // X-axis: Product names
    datasets: [
      {
        label: "Quantity Sold",
        data: salesData.map(item => item.totalQuantitySold),
        backgroundColor: "#4CAF50",
        borderColor: "#388E3C",
        borderWidth: 1
      },
      {
        label: "Total Revenue",
        data: salesData.map(item => item.totalRevenue),
        backgroundColor: "#FF9800",
        borderColor: "#F57C00",
        borderWidth: 1
      },
      {
        label: "Average Price",
        data: salesData.map(item => item.averagePrice),
        backgroundColor: "#2196F3",
        borderColor: "#1976D2",
        borderWidth: 1
      }
    ]
  };

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top"
      },
      tooltip: {
        enabled: true
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Product Name'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Sales Data'
        }
      }
    }
  };

  const Row = ({ index, style }) => (
    <div style={style}>
      <Typography variant="body1">
        <strong>{salesData[index].productName}</strong>
        <br />
        Quantity Sold: {salesData[index].totalQuantitySold} <br />
        Total Revenue: ${salesData[index].totalRevenue.toFixed(2)} <br />
        Average Price: ${salesData[index].averagePrice.toFixed(2)}
      </Typography>
    </div>
  );

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Typography variant="h3" gutterBottom align="center">
        Product Sales
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", maxWidth: 1200 }}>
        {/* Chart for all products */}
        <Box sx={{ width: "50%" }}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6" align="center" gutterBottom>Product Sales Overview</Typography>
            <Bar data={chartData} options={options} />
          </Paper>
        </Box>

        {/* Product List */}
        <Box sx={{ width: "50%", paddingLeft: 2 }}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6" align="center" gutterBottom>Product Sales List</Typography>
            <List
              height={400}
              itemCount={salesData.length}
              itemSize={100}  // Adjust height per item
              width={"100%"}
            >
              {Row}
            </List>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default ProductSalesPage;
