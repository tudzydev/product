export const openapiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Nexus Product Catalog API",
    version: "1.0.0",
    description:
      "Comprehensive OpenAPI 3.0 documentation for the Nexus Product Catalog backend service, powered by Express and Sequelize.",
    contact: {
      name: "API Support",
    },
  },
  servers: [
    {
      url: "http://localhost:5001",
      description: "Local Development Server",
    },
    {
      url: "/",
      description: "Current Host / Relative Path",
    },
  ],
  tags: [
    {
      name: "Health",
      description: "Health checks and system status monitoring",
    },
    {
      name: "Products",
      description: "Product inventory management and bulk operations",
    },
  ],
  paths: {
    "/": {
      get: {
        tags: ["Health"],
        summary: "Root Service Status",
        description: "Returns general service status and welcome message.",
        responses: {
          "200": {
            description: "Service is online",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "ok" },
                    message: {
                      type: "string",
                      example: "Product API is up and running",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/health": {
      get: {
        tags: ["Health"],
        summary: "Detailed Health Check",
        description: "Returns health status, system uptime, and current server timestamp.",
        responses: {
          "200": {
            description: "Detailed system health",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HealthResponse",
                },
              },
            },
          },
        },
      },
    },
    "/api/products": {
      get: {
        tags: ["Products"],
        summary: "List All Products",
        description: "Retrieves a list of all products currently stored in the catalog.",
        responses: {
          "200": {
            description: "Products fetched successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Products fetched successfully",
                    },
                    products: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/Product",
                      },
                    },
                  },
                },
              },
            },
          },
          "500": {
            description: "Server error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Products"],
        summary: "Create New Product",
        description: "Adds a new product to the catalog with name and price.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ProductInput",
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Product created successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Product created successfully",
                    },
                    product: {
                      $ref: "#/components/schemas/Product",
                    },
                  },
                },
              },
            },
          },
          "400": {
            description: "Missing or invalid required fields",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          "500": {
            description: "Server error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },
    "/api/products/seed": {
      post: {
        tags: ["Products"],
        summary: "Seed Sample Products",
        description: "Bulk creates multiple products in a single operation.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/SeedProductsInput",
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Products seeded successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Products seeded successfully",
                    },
                    count: { type: "integer", example: 5 },
                    products: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/Product",
                      },
                    },
                  },
                },
              },
            },
          },
          "400": {
            description: "Invalid input or empty products array",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          "500": {
            description: "Server error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },
    "/api/products/{id}": {
      get: {
        tags: ["Products"],
        summary: "Get Product by ID",
        description: "Retrieves details of a specific product by its ID.",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Numeric ID of the product",
            schema: {
              type: "integer",
              example: 1,
            },
          },
        ],
        responses: {
          "200": {
            description: "Product fetched successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Product fetched successfully",
                    },
                    product: {
                      $ref: "#/components/schemas/Product",
                    },
                  },
                },
              },
            },
          },
          "400": {
            description: "Invalid product ID",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          "404": {
            description: "Product not found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          "500": {
            description: "Server error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
      put: {
        tags: ["Products"],
        summary: "Update Product",
        description: "Updates the name and/or price of an existing product.",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Numeric ID of the product to update",
            schema: {
              type: "integer",
              example: 1,
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ProductUpdateInput",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Product updated successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Product updated successfully",
                    },
                    product: {
                      $ref: "#/components/schemas/Product",
                    },
                  },
                },
              },
            },
          },
          "400": {
            description: "Invalid product ID",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          "404": {
            description: "Product not found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          "500": {
            description: "Server error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Products"],
        summary: "Delete Product",
        description: "Permanently deletes a product by its ID.",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Numeric ID of the product to delete",
            schema: {
              type: "integer",
              example: 1,
            },
          },
        ],
        responses: {
          "200": {
            description: "Product deleted successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Product deleted successfully",
                    },
                  },
                },
              },
            },
          },
          "400": {
            description: "Invalid product ID",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          "404": {
            description: "Product not found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          "500": {
            description: "Server error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Product: {
        type: "object",
        properties: {
          id: {
            type: "integer",
            example: 1,
            description: "Unique auto-incrementing ID",
          },
          name: {
            type: "string",
            example: "Orion Cyber-Keyboard V2",
            description: "Name or title of the product",
          },
          price: {
            type: "number",
            format: "float",
            example: 189.99,
            description: "Price in USD",
          },
          createdAt: {
            type: "string",
            format: "date-time",
            example: "2026-09-16T08:00:00.000Z",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            example: "2026-09-16T08:00:00.000Z",
          },
        },
        required: ["id", "name", "price"],
      },
      ProductInput: {
        type: "object",
        properties: {
          name: {
            type: "string",
            example: "Orion Cyber-Keyboard V2",
            description: "Name of the product",
          },
          price: {
            type: "number",
            format: "float",
            example: 189.99,
            description: "Price of the product",
          },
        },
        required: ["name", "price"],
      },
      ProductUpdateInput: {
        type: "object",
        properties: {
          name: {
            type: "string",
            example: "Orion Cyber-Keyboard V2 (Updated)",
            description: "Updated product name",
          },
          price: {
            type: "number",
            format: "float",
            example: 179.99,
            description: "Updated product price",
          },
        },
      },
      SeedProductsInput: {
        type: "object",
        properties: {
          products: {
            type: "array",
            items: {
              $ref: "#/components/schemas/ProductInput",
            },
            example: [
              { name: "Orion Cyber-Keyboard V2", price: 189.99 },
              { name: "Quantum Fusion Gaming Mouse", price: 89.5 },
            ],
          },
        },
        required: ["products"],
      },
      HealthResponse: {
        type: "object",
        properties: {
          status: {
            type: "string",
            example: "ok",
          },
          uptime: {
            type: "number",
            example: 124.5,
            description: "Server uptime in seconds",
          },
          timestamp: {
            type: "string",
            format: "date-time",
            example: "2026-09-16T08:15:30.000Z",
          },
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          message: {
            type: "string",
            example: "Product not found",
          },
        },
      },
    },
  },
};
