import React from 'react';
import { Paragraph, Tooltip } from '@digdir/designsystemet-react';
import { CheckmarkCircleFillIcon, XMarkOctagonFillIcon } from '@navikt/aksel-icons';

interface EnvironmentInfoFieldProps {
    activeEnvironment: string;
    hasValidPatToken: boolean;
}

/**
 * Komponent som viser informasjon om aktivt miljø og PAT-token status
 */
export const EnvironmentInfoField: React.FC<EnvironmentInfoFieldProps> = ({
    activeEnvironment,
    hasValidPatToken
}) => {
    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <Paragraph data-size="sm" style={{ fontWeight: 'bold' }}>
                    Miljøinformasjon
                </Paragraph>
                <Tooltip content="Viser hvilket miljø organisasjonen vil bli opprettet i og om PAT-token er konfigurert." placement="top">
                    <span style={{ marginLeft: '8px', cursor: 'help', fontSize: '14px' }}>ℹ️</span>
                </Tooltip>
            </div>
            
            <div style={{ 
                padding: '16px', 
                backgroundColor: '#E0F5FB', 
                borderRadius: '4px',
                borderLeft: '4px solid #1E88E5',
                marginBottom: '16px'
            }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <strong>Aktivt miljø:</strong> {activeEnvironment}
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>PAT-token status:</span>
                        {hasValidPatToken ? (
                            <>
                                <CheckmarkCircleFillIcon color="#2D8659" aria-hidden="true" />
                                <span style={{ color: '#2D8659' }}>Gyldig</span>
                            </>
                        ) : (
                            <>
                                <XMarkOctagonFillIcon color="#D41E1E" aria-hidden="true" />
                                <span style={{ color: '#D41E1E' }}>Mangler eller ugyldig</span>
                            </>
                        )}
                    </div>
                    
                    <Paragraph data-size="sm" style={{ marginTop: '4px' }}>
                        {hasValidPatToken 
                            ? 'Organisasjonen vil bli opprettet med gjeldende PAT-token som eier.' 
                            : 'Du må konfigurere et gyldig PAT-token i Innstillinger før du kan opprette en organisasjon.'}
                    </Paragraph>
                </div>
            </div>
        </div>
    );
};
