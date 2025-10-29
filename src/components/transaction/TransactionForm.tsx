"use client";

import React, { useState } from "react";
import { TransactionFormData } from "@/types";
import Input from "../ui/Input";
import Button from "../ui/Button";

interface TransactionFormProps {
  onSubmit: (data: TransactionFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  defaultType?: "credit" | "debit";
  showTypeSelector?: boolean;
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  onSubmit,
  onCancel,
  isLoading = false,
  defaultType = "credit",
  showTypeSelector = false,
}) => {
  const [formData, setFormData] = useState<TransactionFormData>({
    description: "",
    amount: "",
    type: defaultType,
  });
  const [errors, setErrors] = useState<Partial<TransactionFormData>>({});

  // Helper to remove formatting (commas) from amount string
  const unformatAmount = (value: string): string => {
    return value.replace(/,/g, "");
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<TransactionFormData> = {};

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.amount.trim()) {
      newErrors.amount = "Amount is required";
    } else {
      // Remove commas before parsing
      const unformattedAmount = unformatAmount(formData.amount);
      const amount = parseFloat(unformattedAmount);
      if (isNaN(amount) || amount <= 0) {
        newErrors.amount = "Amount must be a positive number";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Remove formatting before submitting
      const cleanedFormData = {
        ...formData,
        amount: unformatAmount(formData.amount),
      };
      onSubmit(cleanedFormData);
      setFormData({ description: "", amount: "", type: defaultType });
      setErrors({});
    }
  };

  const formatAmount = (value: string): string => {
    // If empty, return empty string
    if (!value) return "";

    // Remove all non-numeric characters except decimal point and commas
    // First remove commas so we can process the raw number
    let cleaned = value.replace(/,/g, "");

    // Remove any other non-numeric characters except decimal point
    cleaned = cleaned.replace(/[^0-9.]/g, "");

    // If user is just typing, don't process yet
    if (cleaned === ".") return ".";

    // Handle multiple decimal points - keep only the first one
    const decimalIndex = cleaned.indexOf(".");
    if (decimalIndex !== -1) {
      // Split at first decimal point
      const beforeDecimal = cleaned.substring(0, decimalIndex);
      const afterDecimal = cleaned
        .substring(decimalIndex + 1)
        .replace(/\./g, "");
      cleaned = beforeDecimal + "." + afterDecimal;
    }

    // Split into integer and decimal parts
    const [integerPart, decimalPart] = cleaned.split(".");

    // Process integer part
    let processedInteger = integerPart;

    // Remove leading zeros (except if it's just "0" or "0.")
    if (processedInteger.length > 1) {
      processedInteger = processedInteger.replace(/^0+/, "");
      // If we removed all zeros, keep at least one if there's a decimal part
      if (processedInteger === "" && decimalPart !== undefined) {
        processedInteger = "0";
      } else if (processedInteger === "") {
        processedInteger = "0";
      }
    }

    // If integer part is empty or just "0", handle it
    if (!processedInteger || processedInteger === "") {
      processedInteger = "0";
    }

    // Format integer part with thousand separators
    const formattedInteger = processedInteger.replace(
      /\B(?=(\d{3})+(?!\d))/g,
      ","
    );

    // Handle decimal part
    let formattedDecimal = "";
    if (decimalPart !== undefined) {
      // Limit decimal places to 2
      const limitedDecimal = decimalPart.substring(0, 2);
      formattedDecimal = "." + limitedDecimal;
    }

    // Combine formatted parts
    return formattedInteger + formattedDecimal;
  };

  const handleInputChange = (
    field: keyof TransactionFormData,
    value: string
  ) => {
    let processedValue = value;

    // Auto-format amount field
    if (field === "amount") {
      processedValue = formatAmount(value);
    }

    setFormData((prev) => ({ ...prev, [field]: processedValue }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Description"
        value={formData.description}
        onChange={(e) => handleInputChange("description", e.target.value)}
        placeholder="Enter transaction description"
        error={errors.description}
        disabled={isLoading}
        required
      />

      <Input
        label="Amount"
        type="text"
        value={formData.amount}
        onChange={(e) => handleInputChange("amount", e.target.value)}
        onInput={(e) => handleInputChange("amount", e.currentTarget.value)}
        placeholder="0.00"
        error={errors.amount}
        disabled={isLoading}
        required
      />

      {showTypeSelector && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Transaction Type
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="type"
                value="credit"
                checked={formData.type === "credit"}
                onChange={(e) => handleInputChange("type", e.target.value)}
                className="mr-2 text-blue-600 focus:ring-blue-500"
                disabled={isLoading}
              />
              <span className="text-sm text-gray-700">Credit (Inflow)</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="type"
                value="debit"
                checked={formData.type === "debit"}
                onChange={(e) => handleInputChange("type", e.target.value)}
                className="mr-2 text-blue-600 focus:ring-blue-500"
                disabled={isLoading}
              />
              <span className="text-sm text-gray-700">Debit (Outflow)</span>
            </label>
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" variant="primary" isLoading={isLoading}>
          {formData.type === "credit" ? "Add Money" : "Send Money"}
        </Button>
      </div>
    </form>
  );
};

export default TransactionForm;
