package com.proy.utp.backend_tambo.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Nombre es obligatorio")
    @Size(max = 100, message = "El nombre debe tener como máximo 100 caracteres")
    private String name;

    @NotNull(message = "El precio es obligatorio")
    @DecimalMin(value = "0.01", message = "El precio debe ser mayor que 0")
    private Double price;

    @NotNull(message = "El stock es obligatorio")
    @Min(value = 0, message = "El stock no puede ser negativo")
    private Integer stock;

    @NotBlank(message = "La categoría es obligatoria")
    private String category;

    // Mantener STRING: funciona con tu frontend
    @Lob
    @Column(columnDefinition = "TEXT")
    @JsonIgnore  // ← CLAVE: oculta imagen SOLO en pedidos
    private String image;

    @NotBlank(message = "La descripción es obligatoria")
    @Size(max = 255, message = "La descripción debe tener como máximo 255 caracteres")
    private String description;

    public Product() {}

    public Product(Long id, String name, Double price, Integer stock, String category, String image, String description) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.stock = stock;
        this.category = category;
        this.image = image;
        this.description = description;
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}

