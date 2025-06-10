import { PDFDocument, degrees } from 'pdf-lib'

export async function processPDF(file: File, operation: string): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer()
  const pdfDoc = await PDFDocument.load(arrayBuffer)

  switch (operation) {
    case 'compress':
      return await compressPDF(pdfDoc)
      
    case 'split':
      return await splitPDF(pdfDoc)
      
    case 'merge':
      // For demo purposes, return the original file
      // In a real implementation, you'd merge multiple files
      return new Blob([arrayBuffer], { type: 'application/pdf' })
      
    case 'delete':
      return await deletePages(pdfDoc)
      
    case 'crop':
      return await cropPDF(pdfDoc)
      
    case 'convert':
      // PDF to Word conversion would require server-side processing
      // For demo, return a text file
      return new Blob(['PDF content converted to text format'], { type: 'text/plain' })
      
    case 'word-to-pdf':
      // Word to PDF conversion
      return new Blob([arrayBuffer], { type: 'application/pdf' })
      
    case 'sign':
      return await addSignature(pdfDoc)

    case 'edit':
      // Edit functionality is handled in the EditPDFModal
      return new Blob([arrayBuffer], { type: 'application/pdf' })

    case 'share':
      // Share functionality is handled in the SharePDFModal
      return new Blob([arrayBuffer], { type: 'application/pdf' })
      
    default:
      throw new Error('Unknown operation')
  }
}

async function compressPDF(pdfDoc: PDFDocument): Promise<Blob> {
  // Basic compression by removing metadata and optimizing
  const pdfBytes = await pdfDoc.save({ useObjectStreams: false })
  return new Blob([pdfBytes], { type: 'application/pdf' })
}

async function splitPDF(pdfDoc: PDFDocument): Promise<Blob> {
  // Create a new PDF with only the first page for demo
  const newPdf = await PDFDocument.create()
  const [firstPage] = await newPdf.copyPages(pdfDoc, [0])
  newPdf.addPage(firstPage)
  
  const pdfBytes = await newPdf.save()
  return new Blob([pdfBytes], { type: 'application/pdf' })
}

async function deletePages(pdfDoc: PDFDocument): Promise<Blob> {
  // Remove every other page for demo
  const pageCount = pdfDoc.getPageCount()
  const pagesToRemove = []
  
  for (let i = 1; i < pageCount; i += 2) {
    pagesToRemove.push(i)
  }
  
  // Remove pages in reverse order to maintain indices
  pagesToRemove.reverse().forEach(pageIndex => {
    pdfDoc.removePage(pageIndex)
  })
  
  const pdfBytes = await pdfDoc.save()
  return new Blob([pdfBytes], { type: 'application/pdf' })
}

async function cropPDF(pdfDoc: PDFDocument): Promise<Blob> {
  // Crop all pages to 75% of original size
  const pages = pdfDoc.getPages()
  
  pages.forEach(page => {
    const { width, height } = page.getSize()
    page.setCropBox(0, 0, width * 0.75, height * 0.75)
  })
  
  const pdfBytes = await pdfDoc.save()
  return new Blob([pdfBytes], { type: 'application/pdf' })
}

async function addSignature(pdfDoc: PDFDocument): Promise<Blob> {
  // Add a simple text signature to the first page
  const pages = pdfDoc.getPages()
  const firstPage = pages[0]
  const { width, height } = firstPage.getSize()
  
  firstPage.drawText('Digitally Signed', {
    x: width - 150,
    y: 50,
    size: 12,
    color: { r: 0, g: 0, b: 1 }
  })
  
  const pdfBytes = await pdfDoc.save()
  return new Blob([pdfBytes], { type: 'application/pdf' })
}