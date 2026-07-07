import type { CSSProperties } from 'react';

// Shared interfaces
export interface ReportParam {
  paramName: string;
  paramType: 'INT' | 'DOUBLE' | 'STRING' | 'DATE' | 'BOOL';
  paramDescription: string;
}

export interface ReportContent {
  text: string | object[];
  styleId: number;
  isTable: boolean;
}

export interface ReportResult {
  title: string;
  styleId: number;
  headers: ReportContent[];
  sections: ReportContent[];
  footers: ReportContent[];
}

export interface ReportStyle {
  id: number;
  styleName: string;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  fontSize: number;
  fontColor: string;
  backgroundColor: string;
  horizontalAlignment: string;
  verticalAlignment: string;
  widthPercentage: number;
}

export interface Report {
  id: number;
  reportName: string;
  displayName: string;
  params: ReportParam[];
}

// Utility functions
export const styleToCSS = (reportStyle: ReportStyle | undefined): CSSProperties => {
  if (!reportStyle) return {};
  
  const css: CSSProperties = {};
  if (reportStyle.bold) css.fontWeight = 'bold';
  if (reportStyle.italic) css.fontStyle = 'italic';
  if (reportStyle.underline) css.textDecoration = 'underline';
  if (reportStyle.fontSize) css.fontSize = `${reportStyle.fontSize}px`;
  if (reportStyle.fontColor) css.color = reportStyle.fontColor;
  if (reportStyle.backgroundColor) css.backgroundColor = reportStyle.backgroundColor;
  if (reportStyle.horizontalAlignment) css.textAlign = reportStyle.horizontalAlignment as any;
  if (reportStyle.verticalAlignment) css.verticalAlign = reportStyle.verticalAlignment as any;
  if (reportStyle.widthPercentage) css.width = `${reportStyle.widthPercentage}%`;
  
  return css;
};

export const styleToCSSExcludingWidth = (reportStyle: ReportStyle | undefined): CSSProperties => {
  if (!reportStyle) return {};
  
  const css: CSSProperties = {};
  if (reportStyle.bold) css.fontWeight = 'bold';
  if (reportStyle.italic) css.fontStyle = 'italic';
  if (reportStyle.underline) css.textDecoration = 'underline';
  if (reportStyle.fontSize) css.fontSize = `${reportStyle.fontSize}px`;
  if (reportStyle.fontColor) css.color = reportStyle.fontColor;
  if (reportStyle.backgroundColor) css.backgroundColor = reportStyle.backgroundColor;
  if (reportStyle.horizontalAlignment) css.textAlign = reportStyle.horizontalAlignment as any;
  if (reportStyle.verticalAlignment) css.verticalAlign = reportStyle.verticalAlignment as any;
  
  return css;
};
