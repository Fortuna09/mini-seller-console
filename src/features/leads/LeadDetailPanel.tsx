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
        onClose();
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
                    <div className="fixed inset-0 bg-neutral-500/75 transition-opacity" />
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
                                    <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                                        <div className="bg-neutral-50 px-4 py-6 sm:px-6 border-b border-neutral-200">
                                            <div className="flex items-start justify-between">
                                                <Dialog.Title className="text-lg font-medium text-neutral-900">
                                                    {lead?.name}
                                                </Dialog.Title>
                                                <div className="ml-3 flex h-7 items-center">
                                                    <button
                                                        type="button"
                                                        className="rounded-md bg-neutral-50 text-neutral-400 hover:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary"
                                                        onClick={onClose}
                                                    >
                                                        <span className="sr-only">Close panel</span>
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                            <p className="mt-1 text-sm text-neutral-500">{lead?.company}</p>
                                        </div>

                                        <div className="relative flex-1 px-4 sm:px-6">
                                            <div className="h-full flex flex-col justify-between py-6">
                                                <div className="space-y-6">
                                                    <div>
                                                        <label htmlFor="email" className="block text-sm font-medium text-neutral-700">Email</label>
                                                        <input
                                                            id="email"
                                                            type="email"
                                                            value={editedEmail}
                                                            onChange={(e) => {
                                                                setEditedEmail(e.target.value);
                                                                validateEmail(e.target.value);
                                                            }}
                                                            className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                                        />
                                                        {emailError && (
                                                            <p className="mt-2 text-xs text-red-600">{emailError}</p>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <label htmlFor="status" className="block text-sm font-medium text-neutral-700">Status</label>
                                                        <select
                                                            id="status"
                                                            value={editedStatus}
                                                            onChange={(e) => setEditedStatus(e.target.value as Lead['status'])}
                                                            className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                                        >
                                                            <option>New</option>
                                                            <option>Contacted</option>
                                                            <option>Qualified</option>
                                                            <option>Lost</option>
                                                        </select>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-200">
                                                        <div>
                                                            <h3 className="text-sm font-medium text-neutral-500">Score</h3>
                                                            <p className="mt-1 text-sm font-semibold text-neutral-900">{lead?.score}</p>
                                                        </div>
                                                        <div>
                                                            <h3 className="text-sm font-medium text-neutral-500">Source</h3>
                                                            <p className="mt-1 text-sm text-neutral-900">{lead?.source}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col space-y-3 mt-8">
                                                    <button
                                                        type="button"
                                                        onClick={() => lead && onConvert(lead)}
                                                        className="w-full inline-flex justify-center rounded-md border border-transparent bg-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                                    >
                                                        Convert to Opportunity
                                                    </button>
                                                    <div className="flex space-x-3">
                                                        <button
                                                            type="button"
                                                            onClick={handleSave}
                                                            className="flex-1 inline-flex justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                                                        >
                                                            Save
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={onClose}
                                                            className="flex-1 inline-flex justify-center rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
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