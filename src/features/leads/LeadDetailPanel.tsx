import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import type { Lead } from '../../services/api';

interface LeadDetailPanelProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
}

export function LeadDetailPanel({ lead, isOpen, onClose }: LeadDetailPanelProps) {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-300"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-300"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                    <div className="px-4 sm:px-6">
                      <Dialog.Title className="text-2xl font-semibold leading-6 text-gray-900">
                        {lead?.name}
                      </Dialog.Title>
                    </div>
                    <div className="relative mt-6 flex-1 px-4 sm:px-6">
                      {lead ? (
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">Empresa</h3>
                            <p className="mt-1 text-sm text-gray-900">{lead.company}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">Email</h3>
                            <p className="mt-1 text-sm text-gray-900">{lead.email}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">Status</h3>
                            <p className="mt-1 text-sm text-gray-900">{lead.status}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">Score</h3>
                            <p className="mt-1 text-sm text-gray-900">{lead.score}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">Fonte</h3>
                            <p className="mt-1 text-sm text-gray-900">{lead.source}</p>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}