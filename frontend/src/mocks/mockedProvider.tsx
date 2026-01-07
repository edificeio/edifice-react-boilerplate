/**
 * A wrapper component providing necessary providers for testing environments.
 * Includes Query Client, Edifice Client, and Memory Router providers.
 *
 * @param props - The component props
 * @param {string[]} [props.initialEntries] - Initial entries for the Memory Router
 * @param {ReactNode} [props.children] - Child components to be wrapped by the providers
 *
 * @returns A component wrapped with testing providers
 */
import { EdificeClientProvider } from '@edifice.io/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { queryClient } from '~/providers';

export interface MockedProvidersProps {
  initialEntries?: string[];
  children?: ReactNode;
}

export const MockedProviders = ({
  initialEntries,
  children,
}: MockedProvidersProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <EdificeClientProvider
        params={{
          app: 'boilerplate',
        }}
      >
        <MemoryRouter initialEntries={initialEntries || ['']}>
          {children}
        </MemoryRouter>
      </EdificeClientProvider>
    </QueryClientProvider>
  );
};
