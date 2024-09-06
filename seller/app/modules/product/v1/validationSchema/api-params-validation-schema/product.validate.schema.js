import Joi from 'joi';

module.exports = {
    create: () => {
        return Joi.object({
            commonDetails: Joi.object({
                productCode: Joi.string(),
                productName: Joi.string(),
                HSNCode: Joi.string(),
                vegNonVeg: Joi.string().valid('VEG', 'NONVEG', 'EGG').allow(''),
                timing: Joi.array().items(Joi.string()),
                fulfilmentId: Joi.string().allow(''),
                fulfillmentOption: Joi.string().allow(''),
                GST_Percentage: Joi.number(),
                productCategory: Joi.string(),
                productSubcategory1: Joi.string(),
                productSubcategory2: Joi.string(),
                productSubcategory3: Joi.string(),
                maxAllowedQty: Joi.number(),
                countryOfOrigin: Joi.string(),
                packQty: Joi.any(),
                UOM: Joi.string(), // units of measure
                UOMValue: Joi.string().allow(''),
                length: Joi.any(),
                breadth: Joi.any(),
                height: Joi.any(),
                weight: Joi.any(),
                isReturnable: Joi.boolean(),
                returnWindow: Joi.string(),
                isVegetarian: Joi.boolean(),
                manufacturerName: Joi.string(),
                manufacturedDate: Joi.string(),
                nutritionalInfo: Joi.string().allow(''),
                additiveInfo: Joi.string().allow(''),
                instructions: Joi.string(),
                isCancellable: Joi.boolean(),
                availableOnCod: Joi.boolean(),
                longDescription: Joi.string(),
                description: Joi.string(),
                manufacturerOrPackerName: Joi.string().allow(''),
                manufacturerOrPackerAddress: Joi.string().allow(''),
                commonOrGenericNameOfCommodity: Joi.string().allow(''),
                monthYearOfManufacturePackingImport: Joi.string().allow(''),
                importerFSSAILicenseNo: Joi.string().allow(''),
                brandOwnerFSSAILicenseNo: Joi.string().allow(''),
                varientAttributes: Joi.object(),
                quantity: Joi.number(),
                MRP: Joi.number(),
                purchasePrice: Joi.number(),
                barcode: Joi.number(),
                images: Joi.array().items(Joi.string()),
                type: Joi.string().valid('item', 'customization').required(),
                customizationGroupId: Joi.string().allow(''),
                backImage: Joi.string().allow('')
            }),
            commonAttributesValues: Joi.object(),
            customizationDetails: Joi.object({
                customizationGroups: Joi.array().items(Joi.object()),
                customizations: Joi.array().items(Joi.object())
            })
        });
    },
    
    createWithVariant: () => {
        return Joi.object({
            commonDetails: Joi.object({
                productCode: Joi.string(),
                productName: Joi.string(),
                HSNCode: Joi.string(),
                vegNonVeg: Joi.string().valid('VEG', 'NONVEG', 'EGG').allow(''),
                timing: Joi.array().items(Joi.string()),
                fulfillmentOption: Joi.string().allow(''),
                fulfilmentId: Joi.string().allow(''),
                GST_Percentage: Joi.number(),
                productCategory: Joi.string(),
                productSubcategory1: Joi.string(),
                productSubcategory2: Joi.string(),
                productSubcategory3: Joi.string(),
                countryOfOrigin: Joi.string(),
                maxAllowedQty: Joi.number(),
                packQty: Joi.any(),
                UOM: Joi.string(), // units of measure
                UOMValue: Joi.string().allow(''),
                length: Joi.any(),
                breadth: Joi.any(),
                height: Joi.any(),
                weight: Joi.any(),
                isReturnable: Joi.boolean(),
                returnWindow: Joi.string(),
                isVegetarian: Joi.boolean(),
                manufacturerName: Joi.string(),
                manufacturedDate: Joi.string(),
                nutritionalInfo: Joi.string().allow(''),
                additiveInfo: Joi.string().allow(''),
                instructions: Joi.string(),
                isCancellable: Joi.boolean(),
                availableOnCod: Joi.boolean(),
                longDescription: Joi.string(),
                description: Joi.string(),
                manufacturerOrPackerName: Joi.string().allow(''),
                manufacturerOrPackerAddress: Joi.string().allow(''),
                commonOrGenericNameOfCommodity: Joi.string().allow(''),
                monthYearOfManufacturePackingImport: Joi.string().allow(''),
                importerFSSAILicenseNo: Joi.string().allow(''),
                brandOwnerFSSAILicenseNo: Joi.string().allow(''),
                customizationGroupId: Joi.string(),
                type: Joi.string().valid('Type1', 'Type2', 'Type3', 'Packaged').required(),
                backImage: Joi.string().allow('')
            }),
            commonAttributesValues: Joi.object(),
            variantSpecificDetails: Joi.array().items(
                Joi.object({
                    varientAttributes: Joi.object(),
                    UOMValue: Joi.string(),
                    quantity: Joi.number(),
                    MRP: Joi.number(),
                    purchasePrice: Joi.number(),
                    barcode: Joi.number(),
                    images: Joi.array().items(Joi.string())
                })
            ),
            variationOn: Joi.string(),
            variantType: Joi.array().items(Joi.string()),
            customizationDetails: Joi.object({
                customizationGroups: Joi.array().items(Joi.object()),
                customizations: Joi.array().items(Joi.object())
            })
        });
    },
    
    update: () => {
        return Joi.object({
            commonDetails: Joi.object({
                productCode: Joi.string(),
                productName: Joi.string(),
                HSNCode: Joi.string(),
                vegNonVeg: Joi.string().valid('VEG', 'NONVEG', 'EGG').allow(''),
                timing: Joi.array().items(Joi.string()),
                fulfillmentOption: Joi.string().allow(''),
                fulfilmentId: Joi.string().allow(''),
                GST_Percentage: Joi.number(),
                productCategory: Joi.string(),
                countryOfOrigin: Joi.string(),
                productSubcategory1: Joi.string(),
                productSubcategory2: Joi.string(),
                productSubcategory3: Joi.string(),
                maxAllowedQty: Joi.number(),
                packQty: Joi.any(),
                UOM: Joi.string(), // units of measure
                UOMValue: Joi.string().allow(''),
                length: Joi.any(),
                breadth: Joi.any(),
                height: Joi.any(),
                weight: Joi.any(),
                isReturnable: Joi.boolean(),
                returnWindow: Joi.string(),
                isVegetarian: Joi.boolean(),
                manufacturerName: Joi.string(),
                manufacturedDate: Joi.string(),
                nutritionalInfo: Joi.string().allow(''),
                additiveInfo: Joi.string().allow(''),
                instructions: Joi.string(),
                isCancellable: Joi.boolean(),
                availableOnCod: Joi.boolean(),
                longDescription: Joi.string(),
                description: Joi.string(),
                manufacturerOrPackerName: Joi.string().allow(''),
                manufacturerOrPackerAddress: Joi.string().allow(''),
                commonOrGenericNameOfCommodity: Joi.string().allow(''),
                monthYearOfManufacturePackingImport: Joi.string().allow(''),
                importerFSSAILicenseNo: Joi.string().allow(''),
                brandOwnerFSSAILicenseNo: Joi.string().allow(''),
                varientAttributes: Joi.object(),
                quantity: Joi.number(),
                MRP: Joi.number(),
                purchasePrice: Joi.number(),
                barcode: Joi.number(),
                images: Joi.array().items(Joi.string()),
                customizationGroupId: Joi.string().allow(''),
                type: Joi.string().valid('Type1', 'Type2', 'Type3', 'Packaged').required(),
                backImage: Joi.string().allow('')
            }),
            commonAttributesValues: Joi.object(),
            customizationDetails: Joi.object({
                customizationGroups: Joi.array().items(Joi.object()),
                customizations: Joi.array().items(Joi.object())
            })
        });
    },
    
    updateWithVariant: () => {
        return Joi.object({
            commonDetails: Joi.object({
                productCode: Joi.string(),
                productName: Joi.string(),
                HSNCode: Joi.string(),
                vegNonVeg: Joi.string().valid('VEG', 'NONVEG', 'EGG').allow(''),
                timing: Joi.array().items(Joi.string()),
                fulfillmentOption: Joi.string().allow(''),
                fulfilmentId: Joi.string().allow(''),
                GST_Percentage: Joi.number(),
                productCategory: Joi.string(),
                countryOfOrigin: Joi.string(),
                productSubcategory1: Joi.string(),
                productSubcategory2: Joi.string(),
                productSubcategory3: Joi.string(),
                maxAllowedQty: Joi.number(),
                packQty: Joi.any(),
                UOM: Joi.string(), // units of measure
                UOMValue: Joi.string().allow(''),
                length: Joi.any(),
                breadth: Joi.any(),
                height: Joi.any(),
                weight: Joi.any(),
                isReturnable: Joi.boolean(),
                returnWindow: Joi.string(),
                isVegetarian: Joi.boolean(),
                manufacturerName: Joi.string(),
                manufacturedDate: Joi.string(),
                nutritionalInfo: Joi.string().allow(''),
                additiveInfo: Joi.string().allow(''),
                instructions: Joi.string(),
                isCancellable: Joi.boolean(),
                availableOnCod: Joi.boolean(),
                longDescription: Joi.string(),
                description: Joi.string(),
                manufacturerOrPackerName: Joi.string().allow(''),
                manufacturerOrPackerAddress: Joi.string().allow(''),
                commonOrGenericNameOfCommodity: Joi.string().allow(''),
                monthYearOfManufacturePackingImport: Joi.string().allow(''),
                importerFSSAILicenseNo: Joi.string().allow(''),
                brandOwnerFSSAILicenseNo: Joi.string().allow(''),
                customizationGroupId: Joi.string().allow(''),
                type: Joi.string().valid('Type1', 'Type2', 'Type3', 'Packaged').required(),
                backImage: Joi.string().allow('')
            }),
            commonAttributesValues: Joi.object(),
            variantSpecificDetails: Joi.array().items(
                Joi.object({
                    varientAttributes: Joi.object(),
                    _id: Joi.string(),
                    quantity: Joi.number(),
                    MRP: Joi.number(),
                    purchasePrice: Joi.number(),
                    barcode: Joi.number(),
                    images: Joi.array().items(Joi.string())
                })
            ),
        });
    },

    createCustomization: () => {
        return Joi.object({
            customizationDetails: Joi.object({
                customizationGroups: Joi.array().items(Joi.object()),
                customizations: Joi.array().items(Joi.object())
            })
        });
    },

    publish: () => {
        return Joi.object({
            published: Joi.boolean().required()
        });
    },

    get: () => {
        return Joi.object({
            productId: Joi.string().guid({
                version: ['uuidv4']
            }).required()
        });
    },

    list: () => {
        return Joi.object({
            name: Joi.string().allow(''),
            offset: Joi.number(),
            limit: Joi.number()
        });
    },

    createCust: () => {
        return Joi.object({
            productName: Joi.string(),
            description: Joi.string().allow(''),
            vegNonVeg: Joi.string(),
            UOM: Joi.string(), // units of measure
            UOMValue: Joi.string().allow(''),
            MRP: Joi.number(),
            quantity: Joi.number(),
            maxAllowedQty: Joi.number()
        });
    },

    updateCust: () => {
        return Joi.object({
            productName: Joi.string(),
            description: Joi.string().allow(''),
            vegNonVeg: Joi.string(),
            UOM: Joi.string(), // units of measure
            UOMValue: Joi.string().allow(''),
            MRP: Joi.number(),
            quantity: Joi.number(),
            maxAllowedQty: Joi.number()
        });
    }
};
