document.getElementById("download").addEventListener("click", () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Add content to PDF
  doc.text("Your Webpage Title", 10, 10);
  doc.text("This is some content on your webpage.", 10, 20);
  // You can add more content as needed

  // Save the PDF
  doc.save("webpage.pdf");
});
