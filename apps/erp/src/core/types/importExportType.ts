export const ImportExportType = {
    Local: 0,
    Export: 1,
    ImportAccordingToTheReverseChargeMechanism: 2,
    ImportPaidForCustoms: 3
} as const;

export type ImportExportType = (typeof ImportExportType)[keyof typeof ImportExportType];