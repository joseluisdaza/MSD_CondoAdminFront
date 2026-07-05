import React, { useState, useEffect, CSSProperties } from 'react';
import { ENDPOINTS } from '../api/endpoints';

interface Report {
  id: number;
  reportName: string;
  displayName: string;
  params: ReportParam[];
}

interface ReportParam {
  paramName: string;
  paramType: 'INT' | 'DOUBLE' | 'STRING' | 'DATE' | 'BOOL';
  paramDescription: string;
}

interface ReportContent {
  text: string | object[];
  styleId: number;
  isTable: boolean;
}

interface ReportResult {
  title: string;
  styleId: number;
  headers: ReportContent[];
  sections: ReportContent[];
  footers: ReportContent[];
}

interface ReportStyle {
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

interface ReportesContentProps {
  token: string;
}

const ReportesContent: React.FC<ReportesContentProps> = ({ token }) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReportId, setSelectedReportId] = useState<number | null>(null);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [reportData, setReportData] = useState<ReportResult | null>(null);
  const [styles, setStyles] = useState<Map<number, ReportStyle>>(new Map());
  const [paramValues, setParamValues] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [executing, setExecuting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar lista de reportes
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const response = await fetch(ENDPOINTS.reports, {
          method: 'GET',
          headers: {
            'accept': 'text/plain',
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error('Error al cargar reportes');
        const data = await response.json();
        setReports(data);
        if (data.length > 0) {
          setSelectedReportId(data[0].id);
          setSelectedReport(data[0]);
          setParamValues({});
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [token]);

  // Actualizar reporte seleccionado cuando cambia el ID
  useEffect(() => {
    if (selectedReportId) {
      const report = reports.find(r => r.id === selectedReportId);
      setSelectedReport(report || null);
      setParamValues({});
      setReportData(null);
    }
  }, [selectedReportId, reports]);

  const handleExecuteReport = async () => {
    if (!selectedReportId) return;

    try {
      setExecuting(true);
      setError(null);
      
      // Construir el objeto filters con los parámetros ingresados
      const filters: Record<string, any> = {};
      if (selectedReport?.params) {
        selectedReport.params.forEach(param => {
          filters[param.paramName] = paramValues[param.paramName];
        });
      }
      
      const response = await fetch(ENDPOINTS.executeReport(selectedReportId), {
        method: 'POST',
        headers: {
          'accept': 'text/plain',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filters }),
      });
      if (!response.ok) throw new Error('Error al ejecutar reporte');
      const data = await response.json();
      setReportData(data);
      
      // Extraer todos los styleIds únicos del reporte
      const styleIds = new Set<number>();
      if (data.styleId) styleIds.add(data.styleId);
      data.headers?.forEach((h: ReportContent) => styleIds.add(h.styleId));
      data.sections?.forEach((s: ReportContent) => styleIds.add(s.styleId));
      data.footers?.forEach((f: ReportContent) => styleIds.add(f.styleId));
      
      // Cargar los estilos
      const newStyles = new Map(styles);
      for (const styleId of styleIds) {
        if (!newStyles.has(styleId)) {
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
      }
      setStyles(newStyles);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setExecuting(false);
    }
  };

  const renderParamInput = (param: ReportParam) => {
    const value = paramValues[param.paramName];
    const commonInputStyle = {
      padding: '8px 12px',
      borderRadius: '4px',
      border: '1px solid rgb(100, 100, 100)',
      backgroundColor: 'white',
      color: 'rgb(68, 68, 68)',
      fontSize: '14px',
      width: '100%',
    };

    const handleChange = (newValue: any) => {
      setParamValues(prev => ({
        ...prev,
        [param.paramName]: newValue
      }));
    };

    switch (param.paramType) {
      case 'INT':
        return (
          <input
            type="number"
            step="1"
            value={value || ''}
            onChange={(e) => handleChange(e.target.value ? parseInt(e.target.value) : null)}
            placeholder="Ingrese un número entero"
            style={commonInputStyle}
          />
        );
      case 'DOUBLE':
        return (
          <input
            type="number"
            step="0.01"
            value={value || ''}
            onChange={(e) => handleChange(e.target.value ? parseFloat(e.target.value) : null)}
            placeholder="Ingrese un número decimal"
            style={commonInputStyle}
          />
        );
      case 'STRING':
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => handleChange(e.target.value || null)}
            placeholder="Ingrese un texto"
            style={commonInputStyle}
          />
        );
      case 'DATE':
        return (
          <input
            type="date"
            value={value || ''}
            onChange={(e) => handleChange(e.target.value || null)}
            style={commonInputStyle}
          />
        );
      case 'BOOL':
        return (
          <select
            value={value === null ? '' : value.toString()}
            onChange={(e) => {
              if (e.target.value === '') handleChange(null);
              else handleChange(e.target.value === 'true');
            }}
            style={commonInputStyle}
          >
            <option value="">Seleccione...</option>
            <option value="true">Verdadero</option>
            <option value="false">Falso</option>
          </select>
        );
      default:
        return <input type="text" placeholder="Tipo desconocido" style={commonInputStyle} />;
    }
  };

  const styleToCSS = (reportStyle: ReportStyle | undefined): CSSProperties => {
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

  const renderTable = (data: object[], style?: ReportStyle) => {
    if (!Array.isArray(data) || data.length === 0) return null;
    const headers = Object.keys(data[0]);
    const tableStyle = styleToCSS(style);
    
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

  const renderContent = (item: ReportContent) => {
    const itemStyle = styles.get(item.styleId);
    const cssStyle = styleToCSS(itemStyle);
    
    if (item.isTable && Array.isArray(item.text)) {
      return renderTable(item.text, itemStyle);
    }
    return (
      <p style={{ 
        color: 'rgb(68, 68, 68)', 
        lineHeight: 1.6,
        ...cssStyle 
      }}>
        {typeof item.text === 'string' ? item.text : JSON.stringify(item.text)}
      </p>
    );
  };

  return (
    <div style={{
      padding: '24px',
      backgroundColor: 'rgb(244, 228, 69)',
      minHeight: '100vh',
      color: 'rgb(68, 68, 68)',
    }}>
      <h1 style={{ marginBottom: '24px', fontSize: '28px', fontWeight: 'bold' }}>Reportes</h1>

      {/* Selector de reporte y botón ejecutar */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '24px',
        alignItems: 'center',
      }}>
        <select
          value={selectedReportId || ''}
          onChange={(e) => setSelectedReportId(Number(e.target.value))}
          disabled={loading || reports.length === 0}
          style={{
            padding: '10px 12px',
            borderRadius: '4px',
            border: '1px solid rgb(100, 100, 100)',
            backgroundColor: 'white',
            color: 'rgb(68, 68, 68)',
            fontSize: '14px',
            minWidth: '300px',
            cursor: 'pointer',
          }}
        >
          <option value="">Selecciona un reporte</option>
          {reports.map(report => (
            <option key={report.id} value={report.id}>
              {report.displayName}
            </option>
          ))}
        </select>

        <button
          onClick={handleExecuteReport}
          disabled={!selectedReportId || executing}
          style={{
            padding: '10px 24px',
            backgroundColor: !selectedReportId || executing ? 'rgb(150, 150, 150)' : 'rgb(68, 68, 68)',
            color: 'rgb(244, 228, 69)',
            border: 'none',
            borderRadius: '4px',
            cursor: !selectedReportId || executing ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: 600,
            transition: 'background-color 0.3s',
          }}
          onMouseEnter={(e) => {
            if (selectedReportId && !executing) {
              (e.target as HTMLButtonElement).style.backgroundColor = 'rgb(100, 100, 100)';
            }
          }}
          onMouseLeave={(e) => {
            if (selectedReportId && !executing) {
              (e.target as HTMLButtonElement).style.backgroundColor = 'rgb(68, 68, 68)';
            }
          }}
        >
          {executing ? 'Ejecutando...' : 'Ejecutar'}
        </button>
      </div>

      {/* Grid de parámetros */}
      {selectedReport && selectedReport.params && selectedReport.params.length > 0 && (
        <div style={{
          marginBottom: '24px',
          backgroundColor: 'white',
          borderRadius: '4px',
          padding: '16px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: 600,
            marginBottom: '16px',
            color: 'rgb(68, 68, 68)',
          }}>
            Parámetros del Reporte
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
          }}>
            {selectedReport.params.map(param => (
              <div key={param.paramName} style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}>
                <label style={{
                  fontSize: '14px',
                  fontWeight: 500,
                  color: 'rgb(68, 68, 68)',
                }}>
                  {param.paramDescription}
                </label>
                {renderParamInput(param)}
              </div>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div style={{
          padding: '12px 16px',
          backgroundColor: 'rgb(255, 200, 200)',
          border: '1px solid rgb(255, 100, 100)',
          borderRadius: '4px',
          color: 'rgb(100, 0, 0)',
          marginBottom: '24px',
        }}>
          Error: {error}
        </div>
      )}

      {loading && (
        <p style={{ color: 'rgb(100, 100, 100)', fontStyle: 'italic' }}>
          Cargando reportes...
        </p>
      )}

      {/* Renderizar resultado del reporte */}
      {reportData && (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '4px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        }}>
          <h2 style={{ 
            fontSize: '22px', 
            marginBottom: '16px', 
            color: 'rgb(68, 68, 68)',
            ...styleToCSS(styles.get(reportData.styleId))
          }}>
            {reportData.title}
          </h2>

          {/* Headers */}
          {reportData.headers && reportData.headers.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              {reportData.headers.map((header, idx) => (
                <div key={idx}>
                  {renderContent(header)}
                </div>
              ))}
            </div>
          )}

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
        </div>
      )}

      {!reportData && !loading && reports.length === 0 && (
        <p style={{ color: 'rgb(100, 100, 100)', fontStyle: 'italic' }}>
          No hay reportes disponibles.
        </p>
      )}
    </div>
  );
};

export default ReportesContent;
