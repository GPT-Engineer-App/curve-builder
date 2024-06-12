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
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
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

const Index = () => {
  const [rows, setRows] = useState(Array(3).fill({ columns: Array(2).fill("") }));
  const [numColumns, setNumColumns] = useState(2);
  const [chartData, setChartData] = useState([]);

  const addRow = () => {
    setRows([...rows, { columns: Array(numColumns).fill("") }]);
  };

  const removeRow = (index) => {
    const newRows = rows.filter((_, rowIndex) => rowIndex !== index);
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

  const handleNumColumnsChange = (value) => {
    setNumColumns(value);
    const newRows = rows.map((row) => ({
      columns: Array(value).fill("").map((_, colIndex) => row.columns[colIndex] || ""),
    }));
    setRows(newRows);
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
        <HStack spacing={4} mb={4}>
          <Text fontSize="lg">Number of Columns:</Text>
          <NumberInput
            value={numColumns}
            min={1}
            onChange={(valueString, valueNumber) => handleNumColumnsChange(valueNumber)}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </HStack>
        {rows.map((row, rowIndex) => (
          <Box key={rowIndex} w="100%" p={4} borderWidth={1} borderRadius="md">
            <HStack spacing={4} mb={4}>
              <Text fontSize="lg">Row {rowIndex + 1}</Text>
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