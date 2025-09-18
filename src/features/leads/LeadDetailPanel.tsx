import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import type { Lead } from '../../services/api';

interface LeadDetailPanelProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (lead: Lead) => void;
  onConvert: (lead: Lead) => void;
}

export function LeadDetailPanel({ lead, isOpen, onClose, onUpdate, onConvert }: LeadDetailPanelProps) {
  const [editedEmail, setEditedEmail] = useState('');
  const [editedStatus, setEditedStatus] = useState<Lead['status']>('New');
  const [emailError, setEmailError] = useState('');

  useEffect(() => {
    if (lead) {
      setEditedEmail(lead.email);
      setEditedStatus(lead.status);
      setEmailError('');
    }
  }, [lead]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Por favor, insira um e-mail válido');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleSave = () => {
    if (!lead) return;
    
    if (!validateEmail(editedEmail)) {
      return;
    }

    onUpdate({
      ...lead,
      email: editedEmail,
      status: editedStatus
    });
  };
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
                            <input
                              type="email"
                              value={editedEmail}
                              onChange={(e) => {
                                setEditedEmail(e.target.value);
                                validateEmail(e.target.value);
                              }}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            />
                            {emailError && (
                              <p className="mt-1 text-xs text-red-600">{emailError}</p>
                            )}
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">Status</h3>
                            <select
                              value={editedStatus}
                              onChange={(e) => setEditedStatus(e.target.value as Lead['status'])}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            >
                              <option value="New">Novo</option>
                              <option value="Contacted">Contatado</option>
                              <option value="Qualified">Qualificado</option>
                              <option value="Lost">Perdido</option>
                            </select>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">Score</h3>
                            <p className="mt-1 text-sm text-gray-900">{lead.score}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">Fonte</h3>
                            <p className="mt-1 text-sm text-gray-900">{lead.source}</p>
                          </div>
                          <div className="mt-6 flex space-x-3">
                            <button
                              type="button"
                              onClick={handleSave}
                              className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                              Salvar
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (lead) {
                                  setEditedEmail(lead.email);
                                  setEditedStatus(lead.status);
                                  setEmailError('');
                                }
                              }}
                              className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                              Cancelar
                            </button>
                            <button
                              type="button"
                              onClick={() => lead && onConvert(lead)}
                              className="inline-flex justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                            >
                              Converter em Oportunidade
                            </button>
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