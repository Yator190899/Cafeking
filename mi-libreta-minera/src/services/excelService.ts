import * as XLSX from 'xlsx';
import { Expense } from '../types';

export function exportExpensesToExcel(expenses: Expense[], filterName: string = 'General'): void {
  // Format rows
  const rows = expenses.map((exp, index) => ({
    'N°': index + 1,
    'Fecha': exp.date,
    'Qué compré': exp.item,
    'Descripción': exp.description || '-',
    'Cantidad': exp.quantity,
    'Precio Unitario (S/)': Number(exp.unitPrice.toFixed(2)),
    'Total (S/)': Number(exp.total.toFixed(2)),
    'Proveedor': exp.supplier,
    'Área Minera': exp.miningArea,
    'Método de Pago': exp.paymentMethod || '-',
    'N° Comprobante': exp.receiptNumber || '-'
  }));

  // Calculate grand total
  const grandTotal = expenses.reduce((sum, e) => sum + e.total, 0);

  // Add summary row
  rows.push({
    'N°': '' as any,
    'Fecha': '',
    'Qué compré': 'TOTAL GENERAL (S/)',
    'Descripción': '',
    'Cantidad': '' as any,
    'Precio Unitario (S/)': '' as any,
    'Total (S/)': Number(grandTotal.toFixed(2)),
    'Proveedor': '',
    'Área Minera': '',
    'Método de Pago': '',
    'N° Comprobante': ''
  });

  const worksheet = XLSX.utils.json_to_sheet(rows);

  // Auto-fit column widths
  const colWidths = [
    { wch: 6 },  // N°
    { wch: 12 }, // Fecha
    { wch: 30 }, // Qué compré
    { wch: 35 }, // Descripción
    { wch: 10 }, // Cantidad
    { wch: 18 }, // Precio Unitario
    { wch: 18 }, // Total
    { wch: 28 }, // Proveedor
    { wch: 25 }, // Área Minera
    { wch: 20 }, // Método de Pago
    { wch: 18 }  // N° Comprobante
  ];
  worksheet['!cols'] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Gastos Mineros');

  const dateStr = new Date().toISOString().split('T')[0];
  const cleanFilterName = filterName.replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `Gastos_Mineros_${cleanFilterName}_${dateStr}.xlsx`;

  XLSX.writeFile(workbook, filename);
}

export function exportExpensesToCSV(expenses: Expense[], filterName: string = 'General'): void {
  const headers = [
    'N°',
    'Fecha',
    'Qué compré',
    'Descripción',
    'Cantidad',
    'Precio Unitario (S/)',
    'Total (S/)',
    'Proveedor',
    'Área Minera',
    'Método de Pago',
    'N° Comprobante'
  ];

  const escapeCSV = (val: any) => {
    if (val === undefined || val === null) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const csvRows = [headers.join(';')];

  expenses.forEach((exp, idx) => {
    csvRows.push([
      idx + 1,
      escapeCSV(exp.date),
      escapeCSV(exp.item),
      escapeCSV(exp.description || ''),
      exp.quantity,
      exp.unitPrice.toFixed(2),
      exp.total.toFixed(2),
      escapeCSV(exp.supplier),
      escapeCSV(exp.miningArea),
      escapeCSV(exp.paymentMethod || ''),
      escapeCSV(exp.receiptNumber || '')
    ].join(';'));
  });

  const grandTotal = expenses.reduce((sum, e) => sum + e.total, 0);
  csvRows.push([
    '',
    '',
    '"TOTAL GENERAL (S/)"',
    '',
    '',
    '',
    grandTotal.toFixed(2),
    '',
    '',
    '',
    ''
  ].join(';'));

  // UTF-8 BOM for Excel compatibility
  const blob = new Blob(['\uFEFF' + csvRows.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const dateStr = new Date().toISOString().split('T')[0];
  const a = document.createElement('a');
  a.href = url;
  a.download = `Gastos_Mineros_${filterName}_${dateStr}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
