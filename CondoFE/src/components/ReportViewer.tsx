import React, { useState, useEffect } from 'react';
import type { ReportResult, ReportStyle, ReportContent } from '../utils/reportUtils';
import { styleToCSS, styleToCSSExcludingWidth } from '../utils/reportUtils';
import { ENDPOINTS } from '../api/endpoints';

interface ReportViewerProps {
  token: string;
  reportData: ReportResult;
  onClose: () => void;
}

const ReportViewer: React.FC<ReportViewerProps> = ({ token, reportData, onClose }) => {
  const [styles, setStyles] = useState<Map<number, ReportStyle>>(new Map());
  const [loading, setLoading] = useState(true);

  const renderTable = (data: object[], style?: ReportStyle) => {
    if (!Array.isArray(data) || data.length === 0) return null;
    const headers = Object.keys(data[0]);
    const tableStyle = styleToCSSExcludingWidth(style);
    
    return (
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: 16,
        marginBottom: 16,
        ...tableStyle,
      }}>
        <thead>
          <tr style={{ backgroundColor: 'rgb(220, 198, 39)' }}>
            {headers.map(header => (
              <th key={header} style={{
                border: '1px solid rgb(100, 100, 100)',
                padding: '8px 12px',
                textAlign: 'left',
                fontWeight: 600,
                color: 'rgb(68, 68, 68)',
                ...styleToCSSExcludingWidth(style),
              }}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? 'rgba(244, 228, 69, 0.2)' : 'transparent' }}>
              {headers.map(header => (
                <td key={`${idx}-${header}`} style={{
                  border: '1px solid rgb(100, 100, 100)',
                  padding: '8px 12px',
                  color: 'rgb(68, 68, 68)',
                  ...styleToCSSExcludingWidth(style),
                }}>
                  {String((row as Record<string, any>)[header] || '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  useEffect(() => {
    const loadStyles = async () => {
      try {
        setLoading(true);
        // Extraer todos los styleIds únicos del reporte
        const styleIds = new Set<number>();
        if (reportData.styleId) styleIds.add(reportData.styleId);
        reportData.headers?.forEach((h: ReportContent) => styleIds.add(h.styleId));
        reportData.sections?.forEach((s: ReportContent) => styleIds.add(s.styleId));
        reportData.footers?.forEach((f: ReportContent) => styleIds.add(f.styleId));
        
        // Cargar los estilos
        const newStyles = new Map<number, ReportStyle>();
        for (const styleId of styleIds) {
          try {
            const styleResponse = await fetch(ENDPOINTS.reportStyle(styleId), {
              method: 'GET',
              headers: {
                'accept': 'text/plain',
                'Authorization': `Bearer ${token}`,
              },
            });
            if (styleResponse.ok) {
              const styleData = await styleResponse.json();
              newStyles.set(styleId, styleData);
            }
          } catch (err) {
            console.error(`Error cargando estilo ${styleId}:`, err);
          }
        }
        setStyles(newStyles);
      } finally {
        setLoading(false);
      }
    };

    loadStyles();
  }, [reportData, token]);

  const renderContent = (item: ReportContent) => {
    const itemStyle = styles.get(item.styleId);
    const cssStyle = styleToCSS(itemStyle);
    
    if (item.isTable && Array.isArray(item.text)) {
      return renderTable(item.text, itemStyle);
    }
    return (
      <div style={{ 
        color: 'rgb(68, 68, 68)', 
        lineHeight: 1.6,
        ...cssStyle 
      }}>
        {typeof item.text === 'string' ? item.text : JSON.stringify(item.text)}
      </div>
    );
  };

  const renderHeaders = () => {
    if (!reportData?.headers || reportData.headers.length === 0) return null;

    const result: React.ReactNode[] = [];
    let i = 0;
    let resultIndex = 0;

    while (i < reportData.headers.length) {
      const header = reportData.headers[i];

      // Si isTable es false, renderizar como texto normal
      if (!header.isTable) {
        result.push(
          <div key={`header-${resultIndex}`}>
            {renderContent(header)}
          </div>
        );
        resultIndex++;
        i++;
        continue;
      }

      // Si isTable es true, combinar con el siguiente header si también es tabla
      if (header.isTable && Array.isArray(header.text) && header.text.length > 0) {
        const headerData = (header.text[0] as Record<string, any>);
        const headerKeys = Object.keys(headerData);

        let valueData: Record<string, any> = {};
        let nextHeader: ReportContent | null = null;

        // Buscar el siguiente header con isTable true
        if (
          i + 1 < reportData.headers.length &&
          reportData.headers[i + 1].isTable &&
          Array.isArray(reportData.headers[i + 1].text) &&
          reportData.headers[i + 1].text.length > 0
        ) {
          nextHeader = reportData.headers[i + 1];
          valueData = (nextHeader.text[0] as Record<string, any>) || {};
          i += 2;
        } else {
          i++;
        }

        const headerStyle = styles.get(header.styleId);
        const valueStyle = nextHeader ? styles.get(nextHeader.styleId) : undefined;
        
        const headerCellStyle = styleToCSSExcludingWidth(headerStyle);
        const valueCellStyle = styleToCSSExcludingWidth(valueStyle);

        result.push(
          <table
            key={`header-table-${resultIndex}`}
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              marginTop: 16,
              marginBottom: 16,
            }}
          >
            <tbody>
              {headerKeys.map((key, idx) => (
                <tr key={key} style={{ backgroundColor: idx % 2 === 0 ? 'rgba(244, 228, 69, 0.2)' : 'transparent' }}>
                  <td
                    style={{
                      border: '1px solid rgb(100, 100, 100)',
                      padding: '8px 12px',
                      fontWeight: 600,
                      width: '50%',
                      color: 'rgb(68, 68, 68)',
                      ...headerCellStyle,
                    }}
                  >
                    {String(headerData[key] || key)}
                  </td>
                  <td
                    style={{
                      border: '1px solid rgb(100, 100, 100)',
                      padding: '8px 12px',
                      width: '50%',
                      color: 'rgb(68, 68, 68)',
                      ...valueCellStyle,
                    }}
                  >
                    {String(valueData[key] || '')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
        resultIndex++;
      } else {
        i++;
      }
    }

    return <div style={{ marginBottom: '24px' }}>{result}</div>;
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
        maxWidth: '90%',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '24px',
        position: 'relative',
      }}>
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            backgroundColor: 'rgb(68, 68, 68)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '8px 12px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 600,
          }}
        >
          Cerrar
        </button>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'rgb(68, 68, 68)' }}>
            Cargando estilos del reporte...
          </div>
        ) : (
          <>
            <h2 style={{ 
              fontSize: '22px', 
              marginBottom: '16px', 
              marginTop: '0',
              color: 'rgb(68, 68, 68)',
              ...styleToCSS(styles.get(reportData.styleId))
            }}>
              {reportData.title}
            </h2>

            {/* Headers */}
            {renderHeaders()}

            {/* Sections */}
            {reportData.sections && reportData.sections.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                {reportData.sections.map((section, idx) => (
                  <div key={idx} style={{ marginBottom: '16px' }}>
                    {renderContent(section)}
                  </div>
                ))}
              </div>
            )}

            {/* Footers */}
            {reportData.footers && reportData.footers.length > 0 && (
              <div style={{
                paddingTop: '16px',
                borderTop: '1px solid rgb(200, 200, 200)',
                marginTop: '24px',
              }}>
                {reportData.footers.map((footer, idx) => (
                  <div key={idx}>
                    {renderContent(footer)}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ReportViewer;
