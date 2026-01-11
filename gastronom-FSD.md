# Gastronom FSD

## Version

1.0

## Date

11/01/2026

## Author

Colombo Riccardo

## 1. Purpose and Scope

This document specifies functional requirements, behavior, interfaces, constraints, bugs and exceptions of the website Gastronom

Specifically, the requirements for the website:

- Gastronom is an online shop for Eastern European products, it's based in Italy and its main languages need to be Russian and Italian, but English can be used for the MVP. 
- It needs to have all the usual functions an ecommerce has, a homepage, shop page, about page, a way to organize products, discounts, a cart, a checkout, an account page, possibility of registration from clients, payment and update on deliveries and orders. 
- It needs to be SEO-friendly and have a modern UI design

## 2. System Overview

The website is being developed in Next.js, for the backend of the ecommerce we will use Python and PostgreSQL microservices, but this is not important for the frontend for now.
The domain for the ecommerce is already purchased, some pages are already developed but need work, the design is from Magic Path AI.

## 3. Functional Requirements

### 3.1 Ecommerce Functionality

The system needs to be able to:
- Showcase all products coming from the API
- Organize its products based on filters from the final user
- Provide a cart functionality for products
- Provide a detail page for products
- Provide checkout and payment functionalities
- Provide a way to leave reviews on products

### 3.2 Multiple Languages Functionality

The system needs to be able to provide translated elements in these languages:

- Italian
- Russian
- English
- French

The user needs to be able to switch from language to language as they wish

### 3.3 User Account

The system needs to have user sign-up and sign-in functionalities, and be able to record and showcase various details to the final user, like orders, history, messages, discounts, etc.

### 3.4 Dashboard Functionality

The system needs to have also a way for an admin to log in, to:

- administer orders
- update orders
- complete orders
- reply to messages
- reply to reviews 
- see an overview of revenue and expenses

## 4. Code structure

The main branch for the code will be dev, where new feature branches will be open from and will be merged. We will proceed to do a release when we have enough items to release
The tasks will be broken down further in base of requirements for the releases


