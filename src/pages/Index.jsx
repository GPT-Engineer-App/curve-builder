import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  IconButton,
  Input,
  VStack,
  HStack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { FaPlus, FaTrash } from "react-icons/fa";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";

const Index = () => {
  const [rows, setRows] = useState([{ columns: [""] }]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const addRow = () => {
    setRows([...rows, { columns: [""] }]);
  };

  const removeRow = (index) => {
    const newRows = rows.filter((_, rowIndex) => rowIndex !== index);
    setRows(newRows);
  };

  const addColumn = (rowIndex) => {
    const newRows = rows.map((row, index) => {
      if (index === rowIndex) {
        return { columns: [...row.columns, ""] };
      }
      return row;
    });
    setRows(newRows);
  };

  const removeColumn = (rowIndex, colIndex) => {
    const newRows = rows.map((row, index) => {
      if (index === rowIndex) {
        return {
          columns: row.columns.filter((_, columnIndex) => columnIndex !== colIndex),
        };
      }
      return row;
    });
    setRows(newRows);
  };

  const handleInputChange = (e, rowIndex, colIndex) => {
    const newRows = rows.map((row, index) => {
      if (index === rowIndex) {
        const newColumns = row.columns.map((col, columnIndex) => {
          if (columnIndex === colIndex) {
            return e.target.value;
          }
          return col;
        });
        return { columns: newColumns };
      }
      return row;
    });
    setRows(newRows);
  };

  const fetchECBData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://api.exchangeratesapi.io/latest");
      const data = response.data;
      const newRows = Object.keys(data.rates).map((key, index) => ({
        columns: [key, data.rates[key].toString()],
      }));
      setRows(newRows);
    } catch (error) {
      toast({
        title: "Error fetching data",
        description: "There was an error fetching data from the ECB.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const data = rows.map((row, rowIndex) => {
      const rowData = { name: `Row ${rowIndex + 1}` };
      row.columns.forEach((col, colIndex) => {
        rowData[`Column ${colIndex + 1}`] = col;
      });
      return rowData;
    });
    setChartData(data);
  }, [rows]);

  return (
    <Container maxW="container.lg" py={10}>
      <VStack spacing={6}>
        <Heading as="h1" size="xl" mb={6}>
          Dynamic Rows and Columns
        </Heading>
        <Button onClick={fetchECBData} isLoading={loading} loadingText="Fetching Data">
          Fetch ECB Data
        </Button>
        {rows.map((row, rowIndex) => (
          <Box key={rowIndex} w="100%" p={4} borderWidth={1} borderRadius="md">
            <HStack spacing={4} mb={4}>
              <Text fontSize="lg">Row {rowIndex + 1}</Text>
              <IconButton
                aria-label="Add Column"
                icon={<FaPlus />}
                onClick={() => addColumn(rowIndex)}
              />
              <IconButton
                aria-label="Remove Row"
                icon={<FaTrash />}
                onClick={() => removeRow(rowIndex)}
              />
            </HStack>
            <Flex wrap="wrap" gap={4}>
              {row.columns.map((col, colIndex) => (
                <HStack key={colIndex} spacing={2}>
                  <Input
                    value={col}
                    onChange={(e) => handleInputChange(e, rowIndex, colIndex)}
                    placeholder={`Column ${colIndex + 1}`}
                  />
                  <IconButton
                    aria-label="Remove Column"
                    icon={<FaTrash />}
                    onClick={() => removeColumn(rowIndex, colIndex)}
                  />
                </HStack>
              ))}
            </Flex>
          </Box>
        ))}
        <Button onClick={addRow} leftIcon={<FaPlus />}>
          Add Row
        </Button>
        <Box w="100%" h="400px">
          <ResponsiveContainer>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {rows[0].columns.map((_, colIndex) => (
                <Line
                  key={colIndex}
                  type="monotone"
                  dataKey={`Column ${colIndex + 1}`}
                  stroke={`#${Math.floor(Math.random() * 16777215).toString(16)}`}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </VStack>
    </Container>
  );
};

export default Index;