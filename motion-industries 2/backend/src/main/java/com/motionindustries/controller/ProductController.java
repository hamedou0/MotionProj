package com.motionindustries.controller;

import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.motionindustries.model.Product;
import com.motionindustries.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:3000")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @GetMapping
    public List<Product> getProducts(@RequestParam(required = false, defaultValue = "") String search) {
        if (search.isBlank()) {
            return productRepository.findAll();
        }
        return productRepository.searchProducts(search);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProduct(@PathVariable Long id) {
        return productRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Product createProduct(@RequestBody Product product) {
        return productRepository.save(product);
    }

    @GetMapping("/{id}/export/pdf")
    public ResponseEntity<byte[]> exportPdf(@PathVariable Long id) {
        return productRepository.findById(id)
                .map(product -> {
                    try {
                        byte[] pdfBytes = generatePdf(product);
                        HttpHeaders headers = new HttpHeaders();
                        headers.setContentType(MediaType.APPLICATION_PDF);
                        headers.setContentDispositionFormData("attachment", product.getPartNumber() + ".pdf");
                        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
                    } catch (Exception e) {
                        return new ResponseEntity<byte[]>(HttpStatus.INTERNAL_SERVER_ERROR);
                    }
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/export/csv")
    public ResponseEntity<String> exportCsv(@PathVariable Long id) {
        return productRepository.findById(id)
                .map(product -> {
                    String csv = generateCsv(product);
                    HttpHeaders headers = new HttpHeaders();
                    headers.setContentType(new MediaType("text", "csv"));
                    headers.setContentDispositionFormData("attachment", product.getPartNumber() + ".csv");
                    return new ResponseEntity<>(csv, headers, HttpStatus.OK);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    private byte[] generatePdf(Product product) throws Exception {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        // Add content
        document.add(new Paragraph("Motion Industries - Product Information")
                .setFontSize(18)
                .setBold());
        document.add(new Paragraph("\n"));
        document.add(new Paragraph("Part Number: " + product.getPartNumber()).setFontSize(12));
        document.add(new Paragraph("Name: " + product.getName()).setFontSize(12));
        document.add(new Paragraph("Description: " + product.getDescription()).setFontSize(12));
        document.add(new Paragraph("Price: $" + product.getPrice()).setFontSize(12));
        document.add(new Paragraph("Category: " + product.getCategory()).setFontSize(12));
        document.add(new Paragraph("In Stock: " + (product.getInStock() ? "Yes" : "No")).setFontSize(12));

        document.close();
        return baos.toByteArray();
    }

    private String generateCsv(Product product) {
        StringBuilder csv = new StringBuilder();
        csv.append("Field,Value\n");
        csv.append("Part Number,").append(product.getPartNumber()).append("\n");
        csv.append("Name,").append(escapeCsv(product.getName())).append("\n");
        csv.append("Description,").append(escapeCsv(product.getDescription())).append("\n");
        csv.append("Price,$").append(product.getPrice()).append("\n");
        csv.append("Category,").append(product.getCategory()).append("\n");
        csv.append("In Stock,").append(product.getInStock() ? "Yes" : "No").append("\n");
        return csv.toString();
    }

    private String escapeCsv(String value) {
        if (value == null) return "";
        if (value.contains(",") || value.contains("\"") || value.contains("\n")) {
            return "\"" + value.replace("\"", "\"\"") + "\"";
        }
        return value;
    }
}
