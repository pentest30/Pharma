import { Injectable } from "@angular/core";
import { NgxPermissionsService } from "ngx-permissions";

@Injectable({
  providedIn: "root",
})
export class PermissionsService {
  constructor(private permissionsService: NgxPermissionsService) {
    console.log(rolesTable);
  }

  log() {
    console.log(rolesTable);
  }
}

export namespace Permissions {
  export type PermissionsEnum =
    | "VIEW DASHBOARD"
    | "REF / PROD / LISTING"
    | "REF / PROD / EDIT QUOTA"
    | "TIER / CLIENT / LISTING"
    | "TIER / CLIENT / BLOCK"
    | "STOCK / AVAILABLE / LISTING"
    | "STOCK / RESERVED QUANTITY / LISTING"
    | "ORDERS / ORDERS / LISTING"
    | "ORDERS / ORDERS / CREATE"
    | "ORDERS / PROFORMAT ORDERS / LISTING"
    | "ORDERS / PROFORMAT ORDERS / DELETE"
    | "ORDERS / TRADE AGREEMENT / LISTING"
    | "ORDERS / INVOICES / LISTING"
    | "QUOTAS / DISTRIBUTION / LISTING"
    | "QUOTAS / DISTRIBUTION / CREATE"
    | "QUOTAS / DISTRIBUTION / DELETE"
    | "QUOTAS / DISTRIBUTION / UPDATE"
    | "QUOTAS / SENT DEMANDS / LISTING"
    | "QUOTAS / SENT DEMANDS / CREATE"
    | "QUOTAS / RECEIVE DEMANDS / LISTING"
    | "QUOTAS / RECEIVE DEMANDS / MANAGE"
    | "QUOTAS / DEMANDS / CANCEL"
    | "QUOTAS / REPORTS / VIEW"
    | "QUOTAS / PRODUCTS / AVAILABLE"
    | "QUOTAS / CUSTOMER ASSIGNMENT / VIEW"
    | "ORDER PREPARATION / PRINTING"
    | "ORDER PREPARATION / CONTROLE"
    | "ORDER PREPARATION / CONSOLIDATION"
    | "ORDER PREPARATION / EXPEDITION"
    | "ORDER PREPARATION / ARCHIVE";

  export const PermissionsEnum = {
    ViewDashboard: "VIEW DASHBOARD" as PermissionsEnum,
    RefProdListing: "REF / PROD / LISTING" as PermissionsEnum,
    RefProdEditQuota: "REF / PROD / EDIT QUOTA" as PermissionsEnum,
    TierClientListing: "TIER / CLIENT / LISTING" as PermissionsEnum,
    TierClientBlock: "TIER / CLIENT / BLOCK" as PermissionsEnum,
    StockAvailableListing: "STOCK / AVAILABLE / LISTING" as PermissionsEnum,
    StockReservedQuantityListing:
      "STOCK / RESERVED QUANTITY / LISTING" as PermissionsEnum,
    OrdersOrdersListing: "ORDERS / ORDERS / LISTING" as PermissionsEnum,
    OrdersOrdersCreate: "ORDERS / ORDERS / CREATE" as PermissionsEnum,
    OrdersProformatOrdersListing:
      "ORDERS / PROFORMAT ORDERS / LISTING" as PermissionsEnum,
    OrdersProformatOrdersDelete:
      "ORDERS / PROFORMAT ORDERS / DELETE" as PermissionsEnum,
    OrdersTradeAgreementListing:
      "ORDERS / TRADE AGREEMENT / LISTING" as PermissionsEnum,
    OrdersInvoicesListing: "ORDERS / INVOICES / LISTING" as PermissionsEnum,
    QuotasDistributionListing:
      "QUOTAS / DISTRIBUTION / LISTING" as PermissionsEnum,
    QuotasDistributionCreate:
      "QUOTAS / DISTRIBUTION / CREATE" as PermissionsEnum,
    QuotasDistributionDelete:
      "QUOTAS / DISTRIBUTION / DELETE" as PermissionsEnum,
    QuotasDistributionUpdate:
      "QUOTAS / DISTRIBUTION / UPDATE" as PermissionsEnum,
    QuotasSentDemandsListing:
      "QUOTAS / SENT DEMANDS / LISTING" as PermissionsEnum,
    QuotasSentDemandsCreate:
      "QUOTAS / SENT DEMANDS / CREATE" as PermissionsEnum,
    QuotasReceivedDemandsListing:
      "QUOTAS / RECEIVED DEMANDS / LISTING" as PermissionsEnum,
    QuotasReceivedDemandsManage:
      "QUOTAS / RECEIVED DEMANDS / MANAGE" as PermissionsEnum,
      QuotasCustomerAssignmentView : "QUOTAS / CUSTOMER ASSIGNMENT / VIEW" as PermissionsEnum,
    QuotasReportsView: "QUOTAS / REPORTS / VIEW" as PermissionsEnum,
    QuotasProductsAvailable: "QUOTAS / PRODUCTS / AVAILABLE" as PermissionsEnum,
    OrderPreparationPrinting: "ORDER PREPARATION / PRINTING" as PermissionsEnum,
    OrderPreparationControl: "ORDER PREPARATION / CONTROLE" as PermissionsEnum,
    OrderPreparationConsolidation:
      "ORDER PREPARATION / CONSOLIDATION" as PermissionsEnum,
    OrderPreparationExpedition:
      "ORDER PREPARATION / EXPEDITION" as PermissionsEnum,
    OrderPreparationArchive: "ORDER PREPARATION / ARCHIVE" as PermissionsEnum,
    ReportingView: "REPORTING / VIEW" as PermissionsEnum,
    SuperAdmin: "SuperAdmin" as PermissionsEnum,
  };
}

export namespace Roles {
  export type RolesEnum =
    | "SalesManager"
    | "SalesPerson"
    | "Supervisor"
    | "Buyer"
    | "TechnicalDirector"
    | "BACKOFFICE"
    | "PREPARATION MANAGER"
    | "InventoryManager"
    | "EXPEDITION MANAGER"
    | "EXPEDITOR"
    | "Consolidator"
    | "Controller"
    | "PrintingAgent";
  export const RolesEnum = {
    SalesManager: "SalesManager" as RolesEnum,
    Salesperson: "SalesPerson" as RolesEnum,
    Procurement: "Buyer" as RolesEnum,
    Supervisor: "Supervisor" as RolesEnum,
    TechnicalDirection: "TechnicalDirector" as RolesEnum,
    Backoffice: "BACKOFFICE" as RolesEnum,
    Preparation: "PREPARATION MANAGER" as RolesEnum,
    Stock: "InventoryManager" as RolesEnum,
    Expedition: "EXPEDITION MANAGER" as RolesEnum,
    ExpeditionAgent: "EXPEDITOR" as RolesEnum,
    ConsolidationAgent: "Consolidator" as RolesEnum,
    Controller: "Controller" as RolesEnum,
    PrintingAgent: "PrintingAgent" as RolesEnum,
    SuperAdmin: "SuperAdmin" as RolesEnum,
  };
}

export const rolesTable = {
  [Roles.RolesEnum.SalesManager]: [
    Permissions.PermissionsEnum.ViewDashboard,

    Permissions.PermissionsEnum.RefProdListing,
    Permissions.PermissionsEnum.RefProdEditQuota,
    Permissions.PermissionsEnum.TierClientListing,
    // Permissions.PermissionsEnum.RefClientBlock,

    Permissions.PermissionsEnum.StockAvailableListing,
    Permissions.PermissionsEnum.StockReservedQuantityListing,

    Permissions.PermissionsEnum.OrdersOrdersListing,
    Permissions.PermissionsEnum.OrdersOrdersCreate,
    Permissions.PermissionsEnum.OrdersProformatOrdersListing,
    Permissions.PermissionsEnum.OrdersProformatOrdersDelete,
    // Permissions.PermissionsEnum.OrdersTradeAgreementListing,
    Permissions.PermissionsEnum.OrdersInvoicesListing,

    Permissions.PermissionsEnum.QuotasDistributionListing,
    // Permissions.PermissionsEnum.QuotasDistributionCreate,
    // Permissions.PermissionsEnum.QuotasDistributionDelete,
    // Permissions.PermissionsEnum.QuotasDistributionUpdate,

    // Permissions.PermissionsEnum.QuotasSentDemandsCreate,
    // Permissions.PermissionsEnum.QuotasSentDemandsListing,
    Permissions.PermissionsEnum.QuotasReceivedDemandsListing,
    Permissions.PermissionsEnum.QuotasReceivedDemandsManage,

    Permissions.PermissionsEnum.QuotasReportsView,
    Permissions.PermissionsEnum.QuotasProductsAvailable,

    Permissions.PermissionsEnum.ReportingView,

    // Permissions.PermissionsEnum.OrderPreparationPrinting,
    // Permissions.PermissionsEnum.OrderPreparationControl,
    // Permissions.PermissionsEnum.OrderPreparationConsolidation,
    // Permissions.PermissionsEnum.OrderPreparationExpedition,
    Permissions.PermissionsEnum.OrderPreparationArchive,
  ],
  [Roles.RolesEnum.Supervisor]: [
    Permissions.PermissionsEnum.ViewDashboard,

    Permissions.PermissionsEnum.RefProdListing,
    Permissions.PermissionsEnum.RefProdEditQuota,
    Permissions.PermissionsEnum.TierClientListing,
    // Permissions.PermissionsEnum.RefClientBlock,

    Permissions.PermissionsEnum.StockAvailableListing,
    Permissions.PermissionsEnum.StockReservedQuantityListing,

    Permissions.PermissionsEnum.OrdersOrdersListing,
    Permissions.PermissionsEnum.OrdersOrdersCreate,
    Permissions.PermissionsEnum.OrdersProformatOrdersListing,
    Permissions.PermissionsEnum.OrdersProformatOrdersDelete,
    // Permissions.PermissionsEnum.OrdersTradeAgreementListing,
    Permissions.PermissionsEnum.OrdersInvoicesListing,

    Permissions.PermissionsEnum.QuotasDistributionListing,
    // Permissions.PermissionsEnum.QuotasDistributionCreate,
    // Permissions.PermissionsEnum.QuotasDistributionDelete,
    // Permissions.PermissionsEnum.QuotasDistributionUpdate,

    // Permissions.PermissionsEnum.QuotasSentDemandsCreate,
     Permissions.PermissionsEnum.QuotasSentDemandsListing,
    Permissions.PermissionsEnum.QuotasReceivedDemandsListing,
    Permissions.PermissionsEnum.QuotasReceivedDemandsManage,

    Permissions.PermissionsEnum.QuotasReportsView,
    Permissions.PermissionsEnum.QuotasProductsAvailable,

    Permissions.PermissionsEnum.QuotasCustomerAssignmentView,

    Permissions.PermissionsEnum.ReportingView,
    

    // Permissions.PermissionsEnum.OrderPreparationPrinting,
    // Permissions.PermissionsEnum.OrderPreparationControl,
    // Permissions.PermissionsEnum.OrderPreparationConsolidation,
    // Permissions.PermissionsEnum.OrderPreparationExpedition,
    Permissions.PermissionsEnum.OrderPreparationArchive,
  ],
  [Roles.RolesEnum.Salesperson]: [
    Permissions.PermissionsEnum.ViewDashboard,

    // Permissions.PermissionsEnum.RefProdListing,
    // Permissions.PermissionsEnum.RefProdEditQuota,
    // Permissions.PermissionsEnum.RefClientListing,
    // Permissions.PermissionsEnum.RefClientBlock,

     Permissions.PermissionsEnum.StockAvailableListing,
     Permissions.PermissionsEnum.StockReservedQuantityListing,

    Permissions.PermissionsEnum.OrdersOrdersListing,
    Permissions.PermissionsEnum.OrdersOrdersCreate,
    // Permissions.PermissionsEnum.OrdersProformatOrdersListing,
    // Permissions.PermissionsEnum.OrdersProformatOrdersDelete,
    // Permissions.PermissionsEnum.OrdersTradeAgreementListing,
    Permissions.PermissionsEnum.OrdersInvoicesListing,

     Permissions.PermissionsEnum.QuotasDistributionListing,
    // Permissions.PermissionsEnum.QuotasDistributionCreate,
    // Permissions.PermissionsEnum.QuotasDistributionDelete,
    // Permissions.PermissionsEnum.QuotasDistributionUpdate,

    Permissions.PermissionsEnum.QuotasSentDemandsCreate,
    Permissions.PermissionsEnum.QuotasSentDemandsListing,
     Permissions.PermissionsEnum.QuotasReceivedDemandsListing,
    // Permissions.PermissionsEnum.QuotasReceivedDemandsManage,

    Permissions.PermissionsEnum.QuotasReportsView,
    Permissions.PermissionsEnum.QuotasProductsAvailable,

    Permissions.PermissionsEnum.ReportingView,

    // Permissions.PermissionsEnum.OrderPreparationPrinting,
    // Permissions.PermissionsEnum.OrderPreparationControle,
    // Permissions.PermissionsEnum.OrderPreparationConsolidation,
    // Permissions.PermissionsEnum.OrderPreparationExpedition,
    // Permissions.PermissionsEnum.OrderPreparationArchive,
  ],
  [Roles.RolesEnum.Procurement]: [
    // Permissions.PermissionsEnum.ViewDashboard,

    Permissions.PermissionsEnum.RefProdListing,
    Permissions.PermissionsEnum.RefProdEditQuota,
    Permissions.PermissionsEnum.TierClientListing,
    // Permissions.PermissionsEnum.RefClientBlock,

    Permissions.PermissionsEnum.StockAvailableListing,
    Permissions.PermissionsEnum.StockReservedQuantityListing,

    Permissions.PermissionsEnum.OrdersOrdersListing,
    Permissions.PermissionsEnum.OrdersOrdersCreate,
    // Permissions.PermissionsEnum.OrdersProformatOrdersListing,
    // Permissions.PermissionsEnum.OrdersProformatOrdersDelete,
    Permissions.PermissionsEnum.OrdersTradeAgreementListing,
    Permissions.PermissionsEnum.OrdersInvoicesListing,

    Permissions.PermissionsEnum.QuotasDistributionListing,
    Permissions.PermissionsEnum.QuotasDistributionCreate,
    Permissions.PermissionsEnum.QuotasDistributionDelete,
    Permissions.PermissionsEnum.QuotasDistributionUpdate,

    // Permissions.PermissionsEnum.QuotasSentDemandsCreate,
    // Permissions.PermissionsEnum.QuotasSentDemandsListing,
    // Permissions.PermissionsEnum.QuotasReceivedDemandsListing,
    // Permissions.PermissionsEnum.QuotasReceivedDemandsManage,

    Permissions.PermissionsEnum.QuotasReportsView,
    Permissions.PermissionsEnum.QuotasProductsAvailable,

    // Permissions.PermissionsEnum.OrderPreparationPrinting,
    // Permissions.PermissionsEnum.OrderPreparationControle,
    // Permissions.PermissionsEnum.OrderPreparationConsolidation,
    // Permissions.PermissionsEnum.OrderPreparationExpedition,
    // Permissions.PermissionsEnum.OrderPreparationArchive,
  ],
  [Roles.RolesEnum.TechnicalDirection]: [
    // Permissions.PermissionsEnum.ViewDashboard,

    Permissions.PermissionsEnum.RefProdListing,
    // Permissions.PermissionsEnum.RefProdEditQuota,
    Permissions.PermissionsEnum.TierClientListing,
    // Permissions.PermissionsEnum.RefClientBlock,

    Permissions.PermissionsEnum.StockAvailableListing,
    Permissions.PermissionsEnum.StockReservedQuantityListing,

    Permissions.PermissionsEnum.OrdersOrdersListing,
    // Permissions.PermissionsEnum.OrdersOrdersCreate,
    // Permissions.PermissionsEnum.OrdersProformatOrdersListing,
    // Permissions.PermissionsEnum.OrdersProformatOrdersDelete,
    // Permissions.PermissionsEnum.OrdersTradeAgreementListing,
    Permissions.PermissionsEnum.OrdersInvoicesListing,

    // Permissions.PermissionsEnum.QuotasDistributionListing,
    // Permissions.PermissionsEnum.QuotasDistributionCreate,
    // Permissions.PermissionsEnum.QuotasDistributionDelete,
    // Permissions.PermissionsEnum.QuotasDistributionUpdate,

    // Permissions.PermissionsEnum.QuotasSentDemandsCreate,
    // Permissions.PermissionsEnum.QuotasSentDemandsListing,
    // Permissions.PermissionsEnum.QuotasReceivedDemandsListing,
    // Permissions.PermissionsEnum.QuotasReceivedDemandsManage,

    // Permissions.PermissionsEnum.QuotasReportsView,
    // Permissions.PermissionsEnum.QuotasProductsAvailable,

    // Permissions.PermissionsEnum.OrderPreparationPrinting,
    // Permissions.PermissionsEnum.OrderPreparationControle,
    // Permissions.PermissionsEnum.OrderPreparationConsolidation,
    // Permissions.PermissionsEnum.OrderPreparationExpedition,
    // Permissions.PermissionsEnum.OrderPreparationArchive,
  ],
  [Roles.RolesEnum.Backoffice]: [
    // Permissions.PermissionsEnum.ViewDashboard,

    // Permissions.PermissionsEnum.RefProdListing,
    // Permissions.PermissionsEnum.RefProdEditQuota,
    // Permissions.PermissionsEnum.RefClientListing,
    // Permissions.PermissionsEnum.RefClientBlock,

    // Permissions.PermissionsEnum.StockAvailableListing,
    // Permissions.PermissionsEnum.StockReservedQuantityListing,

    Permissions.PermissionsEnum.OrdersOrdersListing,
    // Permissions.PermissionsEnum.OrdersOrdersCreate,
    // Permissions.PermissionsEnum.OrdersProformatOrdersListing,
    // Permissions.PermissionsEnum.OrdersProformatOrdersDelete,
    // Permissions.PermissionsEnum.OrdersTradeAgreementListing,
    Permissions.PermissionsEnum.OrdersInvoicesListing,

    // Permissions.PermissionsEnum.QuotasDistributionListing,
    // Permissions.PermissionsEnum.QuotasDistributionCreate,
    // Permissions.PermissionsEnum.QuotasDistributionDelete,
    // Permissions.PermissionsEnum.QuotasDistributionUpdate,

    // Permissions.PermissionsEnum.QuotasSentDemandsCreate,
    // Permissions.PermissionsEnum.QuotasSentDemandsListing,
    // Permissions.PermissionsEnum.QuotasReceivedDemandsListing,
    // Permissions.PermissionsEnum.QuotasReceivedDemandsManage,

    // Permissions.PermissionsEnum.QuotasReportsView,
    // Permissions.PermissionsEnum.QuotasProductsAvailable,

    // Permissions.PermissionsEnum.OrderPreparationPrinting,
    // Permissions.PermissionsEnum.OrderPreparationControle,
    // Permissions.PermissionsEnum.OrderPreparationConsolidation,
    // Permissions.PermissionsEnum.OrderPreparationExpedition,
    // Permissions.PermissionsEnum.OrderPreparationArchive,
  ],
  [Roles.RolesEnum.Preparation]: [
    // Permissions.PermissionsEnum.ViewDashboard,

    // Permissions.PermissionsEnum.RefProdListing,
    // Permissions.PermissionsEnum.RefProdEditQuota,
    // Permissions.PermissionsEnum.RefClientListing,
    // Permissions.PermissionsEnum.RefClientBlock,

    Permissions.PermissionsEnum.StockAvailableListing,
    // Permissions.PermissionsEnum.StockReservedQuantityListing,

    // Permissions.PermissionsEnum.OrdersOrdersListing,
    // Permissions.PermissionsEnum.OrdersOrdersCreate,
    // Permissions.PermissionsEnum.OrdersProformatOrdersListing,
    // Permissions.PermissionsEnum.OrdersProformatOrdersDelete,
    // Permissions.PermissionsEnum.OrdersTradeAgreementListing,
    // Permissions.PermissionsEnum.OrdersInvoicesListing,

    // Permissions.PermissionsEnum.QuotasDistributionListing,
    // Permissions.PermissionsEnum.QuotasDistributionCreate,
    // Permissions.PermissionsEnum.QuotasDistributionDelete,
    // Permissions.PermissionsEnum.QuotasDistributionUpdate,

    // Permissions.PermissionsEnum.QuotasSentDemandsCreate,
    // Permissions.PermissionsEnum.QuotasSentDemandsListing,
    // Permissions.PermissionsEnum.QuotasReceivedDemandsListing,
    // Permissions.PermissionsEnum.QuotasReceivedDemandsManage,

    // Permissions.PermissionsEnum.QuotasReportsView,
    // Permissions.PermissionsEnum.QuotasProductsAvailable,

    Permissions.PermissionsEnum.OrderPreparationPrinting,
    Permissions.PermissionsEnum.OrderPreparationControl,
    Permissions.PermissionsEnum.OrderPreparationConsolidation,
    // Permissions.PermissionsEnum.OrderPreparationExpedition,
    Permissions.PermissionsEnum.OrderPreparationArchive,
  ],
  [Roles.RolesEnum.Stock]: [
    // Permissions.PermissionsEnum.ViewDashboard,

    Permissions.PermissionsEnum.RefProdListing,
    // Permissions.PermissionsEnum.RefProdEditQuota,
    // Permissions.PermissionsEnum.RefClientListing,
    // Permissions.PermissionsEnum.RefClientBlock,

    Permissions.PermissionsEnum.StockAvailableListing,
    Permissions.PermissionsEnum.StockReservedQuantityListing,

    Permissions.PermissionsEnum.OrdersOrdersListing,
    // Permissions.PermissionsEnum.OrdersOrdersCreate,
    // Permissions.PermissionsEnum.OrdersProformatOrdersListing,
    // Permissions.PermissionsEnum.OrdersProformatOrdersDelete,
    // Permissions.PermissionsEnum.OrdersTradeAgreementListing,
    Permissions.PermissionsEnum.OrdersInvoicesListing,

    // Permissions.PermissionsEnum.QuotasDistributionListing,
    // Permissions.PermissionsEnum.QuotasDistributionCreate,
    // Permissions.PermissionsEnum.QuotasDistributionDelete,
    // Permissions.PermissionsEnum.QuotasDistributionUpdate,

    // Permissions.PermissionsEnum.QuotasSentDemandsCreate,
    // Permissions.PermissionsEnum.QuotasSentDemandsListing,
    // Permissions.PermissionsEnum.QuotasReceivedDemandsListing,
    // Permissions.PermissionsEnum.QuotasReceivedDemandsManage,

    // Permissions.PermissionsEnum.QuotasReportsView,
    // Permissions.PermissionsEnum.QuotasProductsAvailable,

    // Permissions.PermissionsEnum.OrderPreparationPrinting,
    // Permissions.PermissionsEnum.OrderPreparationControle,
    // Permissions.PermissionsEnum.OrderPreparationConsolidation,
    // Permissions.PermissionsEnum.OrderPreparationExpedition,
    Permissions.PermissionsEnum.OrderPreparationArchive,
  ],
  [Roles.RolesEnum.Expedition]: [
    // Permissions.PermissionsEnum.ViewDashboard,

    // Permissions.PermissionsEnum.RefProdListing,
    // Permissions.PermissionsEnum.RefProdEditQuota,
    Permissions.PermissionsEnum.TierClientListing,
    // Permissions.PermissionsEnum.RefClientBlock,

    // Permissions.PermissionsEnum.StockAvailableListing,
    // Permissions.PermissionsEnum.StockReservedQuantityListing,

    Permissions.PermissionsEnum.OrdersOrdersListing,
    // Permissions.PermissionsEnum.OrdersOrdersCreate,
    // Permissions.PermissionsEnum.OrdersProformatOrdersListing,
    // Permissions.PermissionsEnum.OrdersProformatOrdersDelete,
    // Permissions.PermissionsEnum.OrdersTradeAgreementListing,
    Permissions.PermissionsEnum.OrdersInvoicesListing,

    // Permissions.PermissionsEnum.QuotasDistributionListing,
    // Permissions.PermissionsEnum.QuotasDistributionCreate,
    // Permissions.PermissionsEnum.QuotasDistributionDelete,
    // Permissions.PermissionsEnum.QuotasDistributionUpdate,

    // Permissions.PermissionsEnum.QuotasSentDemandsCreate,
    // Permissions.PermissionsEnum.QuotasSentDemandsListing,
    // Permissions.PermissionsEnum.QuotasReceivedDemandsListing,
    // Permissions.PermissionsEnum.QuotasReceivedDemandsManage,

    // Permissions.PermissionsEnum.QuotasReportsView,
    // Permissions.PermissionsEnum.QuotasProductsAvailable,

    // Permissions.PermissionsEnum.OrderPreparationPrinting,
    // Permissions.PermissionsEnum.OrderPreparationControle,
    Permissions.PermissionsEnum.OrderPreparationConsolidation,
    Permissions.PermissionsEnum.OrderPreparationExpedition,
    Permissions.PermissionsEnum.OrderPreparationArchive,
  ],
  [Roles.RolesEnum.ExpeditionAgent]: [
    // Permissions.PermissionsEnum.ViewDashboard,

    // Permissions.PermissionsEnum.RefProdListing,
    // Permissions.PermissionsEnum.RefProdEditQuota,
    // Permissions.PermissionsEnum.RefClientListing,
    // Permissions.PermissionsEnum.RefClientBlock,

    // Permissions.PermissionsEnum.StockAvailableListing,
    // Permissions.PermissionsEnum.StockReservedQuantityListing,

    // Permissions.PermissionsEnum.OrdersOrdersListing,
    // Permissions.PermissionsEnum.OrdersOrdersCreate,
    // Permissions.PermissionsEnum.OrdersProformatOrdersListing,
    // Permissions.PermissionsEnum.OrdersProformatOrdersDelete,
    // Permissions.PermissionsEnum.OrdersTradeAgreementListing,
    // Permissions.PermissionsEnum.OrdersInvoicesListing,

    // Permissions.PermissionsEnum.QuotasDistributionListing,
    // Permissions.PermissionsEnum.QuotasDistributionCreate,
    // Permissions.PermissionsEnum.QuotasDistributionDelete,
    // Permissions.PermissionsEnum.QuotasDistributionUpdate,

    // Permissions.PermissionsEnum.QuotasSentDemandsCreate,
    // Permissions.PermissionsEnum.QuotasSentDemandsListing,
    // Permissions.PermissionsEnum.QuotasReceivedDemandsListing,
    // Permissions.PermissionsEnum.QuotasReceivedDemandsManage,

    // Permissions.PermissionsEnum.QuotasReportsView,
    // Permissions.PermissionsEnum.QuotasProductsAvailable,

    // Permissions.PermissionsEnum.OrderPreparationPrinting,
    // Permissions.PermissionsEnum.OrderPreparationControle,
    // Permissions.PermissionsEnum.OrderPreparationConsolidation,
    Permissions.PermissionsEnum.OrderPreparationExpedition,
    Permissions.PermissionsEnum.OrderPreparationArchive,
  ],
  [Roles.RolesEnum.ConsolidationAgent]: [
    // Permissions.PermissionsEnum.ViewDashboard,

    // Permissions.PermissionsEnum.RefProdListing,
    // Permissions.PermissionsEnum.RefProdEditQuota,
    // Permissions.PermissionsEnum.RefClientListing,
    // Permissions.PermissionsEnum.RefClientBlock,

    // Permissions.PermissionsEnum.StockAvailableListing,
    // Permissions.PermissionsEnum.StockReservedQuantityListing,

    // Permissions.PermissionsEnum.OrdersOrdersListing,
    // Permissions.PermissionsEnum.OrdersOrdersCreate,
    // Permissions.PermissionsEnum.OrdersProformatOrdersListing,
    // Permissions.PermissionsEnum.OrdersProformatOrdersDelete,
    // Permissions.PermissionsEnum.OrdersTradeAgreementListing,
    // Permissions.PermissionsEnum.OrdersInvoicesListing,

    // Permissions.PermissionsEnum.QuotasDistributionListing,
    // Permissions.PermissionsEnum.QuotasDistributionCreate,
    // Permissions.PermissionsEnum.QuotasDistributionDelete,
    // Permissions.PermissionsEnum.QuotasDistributionUpdate,

    // Permissions.PermissionsEnum.QuotasSentDemandsCreate,
    // Permissions.PermissionsEnum.QuotasSentDemandsListing,
    // Permissions.PermissionsEnum.QuotasReceivedDemandsListing,
    // Permissions.PermissionsEnum.QuotasReceivedDemandsManage,

    // Permissions.PermissionsEnum.QuotasReportsView,
    // Permissions.PermissionsEnum.QuotasProductsAvailable,

    // Permissions.PermissionsEnum.OrderPreparationPrinting,
    // Permissions.PermissionsEnum.OrderPreparationControle,
    Permissions.PermissionsEnum.OrderPreparationConsolidation,
    // Permissions.PermissionsEnum.OrderPreparationExpedition,
    Permissions.PermissionsEnum.OrderPreparationArchive,
  ],
  [Roles.RolesEnum.Controller]: [
    // Permissions.PermissionsEnum.ViewDashboard,

    // Permissions.PermissionsEnum.RefProdListing,
    // Permissions.PermissionsEnum.RefProdEditQuota,
    // Permissions.PermissionsEnum.RefClientListing,
    // Permissions.PermissionsEnum.RefClientBlock,

    // Permissions.PermissionsEnum.StockAvailableListing,
    // Permissions.PermissionsEnum.StockReservedQuantityListing,

    // Permissions.PermissionsEnum.OrdersOrdersListing,
    // Permissions.PermissionsEnum.OrdersOrdersCreate,
    // Permissions.PermissionsEnum.OrdersProformatOrdersListing,
    // Permissions.PermissionsEnum.OrdersProformatOrdersDelete,
    // Permissions.PermissionsEnum.OrdersTradeAgreementListing,
    // Permissions.PermissionsEnum.OrdersInvoicesListing,

    // Permissions.PermissionsEnum.QuotasDistributionListing,
    // Permissions.PermissionsEnum.QuotasDistributionCreate,
    // Permissions.PermissionsEnum.QuotasDistributionDelete,
    // Permissions.PermissionsEnum.QuotasDistributionUpdate,

    // Permissions.PermissionsEnum.QuotasSentDemandsCreate,
    // Permissions.PermissionsEnum.QuotasSentDemandsListing,
    // Permissions.PermissionsEnum.QuotasReceivedDemandsListing,
    // Permissions.PermissionsEnum.QuotasReceivedDemandsManage,

    // Permissions.PermissionsEnum.QuotasReportsView,
    // Permissions.PermissionsEnum.QuotasProductsAvailable,

    // Permissions.PermissionsEnum.OrderPreparationPrinting,
    Permissions.PermissionsEnum.OrderPreparationControl,
    // Permissions.PermissionsEnum.OrderPreparationConsolidation,
    // Permissions.PermissionsEnum.OrderPreparationExpedition,
    Permissions.PermissionsEnum.OrderPreparationArchive,
  ],
  [Roles.RolesEnum.PrintingAgent]: [
    // Permissions.PermissionsEnum.ViewDashboard,

    // Permissions.PermissionsEnum.RefProdListing,
    // Permissions.PermissionsEnum.RefProdEditQuota,
    // Permissions.PermissionsEnum.RefClientListing,
    // Permissions.PermissionsEnum.RefClientBlock,

    // Permissions.PermissionsEnum.StockAvailableListing,
    // Permissions.PermissionsEnum.StockReservedQuantityListing,

    // Permissions.PermissionsEnum.OrdersOrdersListing,
    // Permissions.PermissionsEnum.OrdersOrdersCreate,
    // Permissions.PermissionsEnum.OrdersProformatOrdersListing,
    // Permissions.PermissionsEnum.OrdersProformatOrdersDelete,
    // Permissions.PermissionsEnum.OrdersTradeAgreementListing,
    // Permissions.PermissionsEnum.OrdersInvoicesListing,

    // Permissions.PermissionsEnum.QuotasDistributionListing,
    // Permissions.PermissionsEnum.QuotasDistributionCreate,
    // Permissions.PermissionsEnum.QuotasDistributionDelete,
    // Permissions.PermissionsEnum.QuotasDistributionUpdate,

    // Permissions.PermissionsEnum.QuotasSentDemandsCreate,
    // Permissions.PermissionsEnum.QuotasSentDemandsListing,
    // Permissions.PermissionsEnum.QuotasReceivedDemandsListing,
    // Permissions.PermissionsEnum.QuotasReceivedDemandsManage,

    // Permissions.PermissionsEnum.QuotasReportsView,
    // Permissions.PermissionsEnum.QuotasProductsAvailable,

    Permissions.PermissionsEnum.OrderPreparationPrinting,
    // Permissions.PermissionsEnum.OrderPreparationControle,
    // Permissions.PermissionsEnum.OrderPreparationConsolidation,
    // Permissions.PermissionsEnum.OrderPreparationExpedition,
    Permissions.PermissionsEnum.OrderPreparationArchive,
  ],
  [Roles.RolesEnum.SuperAdmin]: [Permissions.PermissionsEnum.ViewDashboard],
};
