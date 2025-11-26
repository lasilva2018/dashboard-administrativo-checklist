import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { Inspecao } from "./types";
import { formatDate } from "./utils";

// Exportar inspeções para PDF
export function exportToPDF(inspecoes: Inspecao[], titulo: string = "Relatório de Inspeções") {
  const doc = new jsPDF();
  
  // Cabeçalho
  doc.setFontSize(18);
  doc.text(titulo, 14, 20);
  
  doc.setFontSize(11);
  doc.text(`Gerado em: ${formatDate(new Date())}`, 14, 28);
  doc.text(`Total de inspeções: ${inspecoes.length}`, 14, 34);
  
  // Estatísticas
  const pendentes = inspecoes.filter(i => i.status === "Pendente Aprovação").length;
  const aprovadas = inspecoes.filter(i => i.status === "Aprovada").length;
  const reprovadas = inspecoes.filter(i => i.status === "Reprovada").length;
  
  doc.setFontSize(10);
  doc.text(`Pendentes: ${pendentes} | Aprovadas: ${aprovadas} | Reprovadas: ${reprovadas}`, 14, 40);
  
  // Tabela de inspeções
  const tableData = inspecoes.map(inspecao => {
    const itemsNOK = inspecao.itens.filter(item => item.status === "NOK").length;
    return [
      `#${inspecao.id}`,
      formatDate(inspecao.data),
      inspecao.condominio,
      inspecao.zelador,
      `${inspecao.itens.length} (${itemsNOK} NOK)`,
      inspecao.status === "Pendente Aprovação" ? "Pendente" : inspecao.status,
    ];
  });
  
  autoTable(doc, {
    startY: 48,
    head: [["ID", "Data", "Condomínio", "Zelador", "Itens", "Status"]],
    body: tableData,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [30, 58, 138] }, // Azul Pensou
    alternateRowStyles: { fillColor: [245, 247, 250] },
  });
  
  // Salvar PDF
  const filename = `relatorio-inspecoes-${new Date().getTime()}.pdf`;
  doc.save(filename);
}

// Exportar inspeção individual para PDF
export function exportInspecaoToPDF(inspecao: Inspecao) {
  const doc = new jsPDF();
  
  // Cabeçalho
  doc.setFontSize(18);
  doc.text(`Inspeção #${inspecao.id}`, 14, 20);
  
  doc.setFontSize(11);
  doc.text(`Data: ${formatDate(inspecao.data)}`, 14, 28);
  doc.text(`Status: ${inspecao.status}`, 14, 34);
  
  // Informações gerais
  doc.setFontSize(14);
  doc.text("Informações Gerais", 14, 46);
  
  doc.setFontSize(10);
  doc.text(`Condomínio: ${inspecao.condominio}`, 14, 54);
  doc.text(`Zelador: ${inspecao.zelador}`, 14, 60);
  doc.text(`Total de itens: ${inspecao.itens.length}`, 14, 66);
  
  // Checklist
  doc.setFontSize(14);
  doc.text("Checklist de Inspeção", 14, 78);
  
  const tableData = inspecao.itens.map(item => [
    item.item,
    item.status,
    item.observacao || "-",
  ]);
  
  autoTable(doc, {
    startY: 84,
    head: [["Item", "Status", "Observação"]],
    body: tableData,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [30, 58, 138] },
    columnStyles: {
      0: { cellWidth: 80 },
      1: { cellWidth: 20, halign: "center" },
      2: { cellWidth: 80 },
    },
  });
  
  // Histórico de aprovação
  if (inspecao.aprovadoPor) {
    const finalY = (doc as any).lastAutoTable.finalY || 84;
    
    doc.setFontSize(14);
    doc.text("Histórico de Aprovação", 14, finalY + 14);
    
    doc.setFontSize(10);
    doc.text(`Aprovado/Reprovado por: ${inspecao.aprovadoPor}`, 14, finalY + 22);
    if (inspecao.dataAprovacao) {
      doc.text(`Data: ${formatDate(inspecao.dataAprovacao)}`, 14, finalY + 28);
    }
    if (inspecao.comentarioSindico) {
      doc.text(`Comentário: ${inspecao.comentarioSindico}`, 14, finalY + 34, {
        maxWidth: 180,
      });
    }
  }
  
  // Salvar PDF
  const filename = `inspecao-${inspecao.id}-${new Date().getTime()}.pdf`;
  doc.save(filename);
}

// Exportar inspeções para Excel
export function exportToExcel(inspecoes: Inspecao[], filename: string = "relatorio-inspecoes") {
  // Preparar dados
  const data = inspecoes.map(inspecao => {
    const itemsOK = inspecao.itens.filter(item => item.status === "OK").length;
    const itemsNOK = inspecao.itens.filter(item => item.status === "NOK").length;
    const itemsNA = inspecao.itens.filter(item => item.status === "NA").length;
    
    return {
      ID: inspecao.id,
      Data: formatDate(inspecao.data),
      Condomínio: inspecao.condominio,
      Zelador: inspecao.zelador,
      "Total de Itens": inspecao.itens.length,
      "Itens OK": itemsOK,
      "Itens NOK": itemsNOK,
      "Itens N/A": itemsNA,
      Status: inspecao.status,
      "Aprovado Por": inspecao.aprovadoPor || "-",
      "Data Aprovação": inspecao.dataAprovacao ? formatDate(inspecao.dataAprovacao) : "-",
      Comentário: inspecao.comentarioSindico || "-",
    };
  });
  
  // Criar workbook
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Inspeções");
  
  // Ajustar largura das colunas
  const maxWidth = 50;
  const colWidths = Object.keys(data[0] || {}).map(key => ({
    wch: Math.min(
      Math.max(
        key.length,
        ...data.map(row => String(row[key as keyof typeof row]).length)
      ),
      maxWidth
    ),
  }));
  worksheet["!cols"] = colWidths;
  
  // Salvar arquivo
  XLSX.writeFile(workbook, `${filename}-${new Date().getTime()}.xlsx`);
}

// Exportar detalhes completos de uma inspeção para Excel
export function exportInspecaoToExcel(inspecao: Inspecao) {
  const workbook = XLSX.utils.book_new();
  
  // Aba 1: Informações Gerais
  const infoData = [
    { Campo: "ID", Valor: inspecao.id },
    { Campo: "Data", Valor: formatDate(inspecao.data) },
    { Campo: "Condomínio", Valor: inspecao.condominio },
    { Campo: "Zelador", Valor: inspecao.zelador },
    { Campo: "Status", Valor: inspecao.status },
    { Campo: "Total de Itens", Valor: inspecao.itens.length },
    { Campo: "Aprovado Por", Valor: inspecao.aprovadoPor || "-" },
    { Campo: "Data Aprovação", Valor: inspecao.dataAprovacao ? formatDate(inspecao.dataAprovacao) : "-" },
    { Campo: "Comentário", Valor: inspecao.comentarioSindico || "-" },
  ];
  
  const infoSheet = XLSX.utils.json_to_sheet(infoData);
  XLSX.utils.book_append_sheet(workbook, infoSheet, "Informações");
  
  // Aba 2: Checklist
  const checklistData = inspecao.itens.map(item => ({
    Item: item.item,
    Status: item.status,
    Observação: item.observacao || "-",
    Foto: item.foto ? "Sim" : "Não",
  }));
  
  const checklistSheet = XLSX.utils.json_to_sheet(checklistData);
  XLSX.utils.book_append_sheet(workbook, checklistSheet, "Checklist");
  
  // Salvar arquivo
  XLSX.writeFile(workbook, `inspecao-${inspecao.id}-${new Date().getTime()}.xlsx`);
}
