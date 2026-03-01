/**
 * Contacts View - Contact Management
 * Uses UnifiedPageTemplate per Day 3 Best Practice
 */

"use client"

import { useState } from "react"
import { 
  ListPageTemplate, 
  type KPIItem 
} from "@/components/layouts/unified-page-template"
import { 
  User,
  Plus,
  Mail,
  Phone,
  Building2,
  Linkedin,
  MoreHorizontal,
  MessageSquare,
  Calendar,
  Star
} from "lucide-react"

const mockContacts = [
  {
    id: "contact-001",
    name: "John Smith",
    email: "john.smith@acmecorp.com",
    phone: "+1 (555) 123-4567",
    company: "Acme Corporation",
    title: "VP of Sales",
    isPrimary: true,
    lastContact: "2024-01-15T10:00:00Z",
    linkedin: "johnsmith"
  },
  {
    id: "contact-002",
    name: "Emily Johnson",
    email: "emily@techstart.io",
    phone: "+1 (555) 234-5678",
    company: "TechStart Inc",
    title: "CTO",
    isPrimary: true,
    lastContact: "2024-01-14T14:30:00Z",
    linkedin: "emilyjohnson"
  },
  {
    id: "contact-003",
    name: "Michael Chen",
    email: "m.chen@globaltech.com",
    phone: "+1 (555) 345-6789",
    company: "GlobalTech",
    title: "Head of Operations",
    isPrimary: false,
    lastContact: "2024-01-13T09:15:00Z",
    linkedin: "michaelchen"
  },
  {
    id: "contact-004",
    name: "Sarah Williams",
    email: "sarah@innovate.co",
    phone: "+1 (555) 456-7890",
    company: "Innovate Co",
    title: "CEO",
    isPrimary: true,
    lastContact: "2024-01-10T16:45:00Z",
    linkedin: "sarahwilliams"
  },
]

const kpis: KPIItem[] = [
  { label: "Total Contacts", value: "1,234", color: "primary" },
  { label: "Primary Contacts", value: "156", icon: <Star className="w-4 h-4" /> },
  { label: "Added This Month", value: "45", change: "+12% vs last month", changeType: "positive" },
  { label: "Avg Response Rate", value: "34%", change: "+5%", changeType: "positive" },
]

export function ContactsView() {
  const [contacts] = useState(mockContacts)
  const [selectedContact, setSelectedContact] = useState<string | null>(null)
  const [rightPanelOpen, setRightPanelOpen] = useState(false)

  const selected = contacts.find(c => c.id === selectedContact)

  return (
    <ListPageTemplate
      title="Contacts"
      description="Manage your business contacts"
      stageId="SALES-CONTACTS-001"
      breadcrumbs={[
        { label: "Sales", href: "/sales" },
        { label: "Contacts" }
      ]}
      kpis={kpis}
      headerActions={
        <button className="px-4 py-2 bg-[#2D7A3E] text-white rounded-lg text-sm font-medium hover:bg-[#246832] flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Contact
        </button>
      }
      rightPanel={selected ? (
        <div className="space-y-4">
          <div className="text-center pb-4 border-b border-gray-200">
            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-3 flex items-center justify-center">
              <User className="w-8 h-8 text-gray-500" />
            </div>
            <p className="text-gray-900 font-medium">{selected.name}</p>
            <p className="text-sm text-gray-500">{selected.title}</p>
            {selected.isPrimary && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium mt-2">
                <Star className="w-3 h-3" />
                Primary Contact
              </span>
            )}
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Email</h4>
            <a href={`mailto:${selected.email}`} className="text-[#2D7A3E] hover:underline text-sm">
              {selected.email}
            </a>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Phone</h4>
            <a href={`tel:${selected.phone}`} className="text-gray-900 text-sm">
              {selected.phone}
            </a>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Company</h4>
            <p className="text-gray-900 flex items-center gap-1">
              <Building2 className="w-3 h-3 text-gray-400" />
              {selected.company}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">LinkedIn</h4>
            <a href={`https://linkedin.com/in/${selected.linkedin}`} className="text-[#2D7A3E] hover:underline text-sm flex items-center gap-1">
              <Linkedin className="w-3 h-3" />
              {selected.linkedin}
            </a>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Last Contact</h4>
            <p className="text-gray-900 text-sm flex items-center gap-1">
              <Calendar className="w-3 h-3 text-gray-400" />
              {new Date(selected.lastContact).toLocaleString()}
            </p>
          </div>
          <div className="pt-4 border-t border-gray-200 grid grid-cols-3 gap-2">
            <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 flex flex-col items-center gap-1">
              <Phone className="w-4 h-4" />
              <span className="text-xs">Call</span>
            </button>
            <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 flex flex-col items-center gap-1">
              <Mail className="w-4 h-4" />
              <span className="text-xs">Email</span>
            </button>
            <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 flex flex-col items-center gap-1">
              <MessageSquare className="w-4 h-4" />
              <span className="text-xs">Note</span>
            </button>
          </div>
        </div>
      ) : null}
      rightPanelTitle="Contact Details"
      rightPanelOpen={rightPanelOpen}
      onRightPanelClose={() => setRightPanelOpen(false)}
      isEmpty={contacts.length === 0}
      emptyState={{
        icon: <User className="w-12 h-12" />,
        title: "No Contacts Yet",
        description: "Add your first contact to start building relationships.",
        action: (
          <button className="px-4 py-2 bg-[#2D7A3E] text-white rounded-lg text-sm font-medium hover:bg-[#246832]">
            Add First Contact
          </button>
        )
      }}
    >
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Contact</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Company</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Title</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Phone</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Last Contact</th>
              <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {contacts.map((contact) => (
              <tr 
                key={contact.id}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => {
                  setSelectedContact(contact.id)
                  setRightPanelOpen(true)
                }}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-500" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-gray-900">{contact.name}</p>
                        {contact.isPrimary && <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />}
                      </div>
                      <p className="text-xs text-gray-500">{contact.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{contact.company}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{contact.title}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{contact.phone}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{new Date(contact.lastContact).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-right">
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <MoreHorizontal className="w-4 h-4 text-gray-400" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ListPageTemplate>
  )
}

export default ContactsView
