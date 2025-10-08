'use client'

import { useState } from 'react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { HelpCircle, Search, MessageCircle, Mail, Phone, Book, Video, FileText, Send, ExternalLink } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "Cum adaug o programare nouă?",
    answer: "Pentru a adăuga o programare nouă, mergi la secțiunea 'Programări' din meniul lateral și click pe butonul 'Programare Nouă' sau folosește butonul 'Programare Rapidă' din partea de sus a meniului."
  },
  {
    question: "Cum pot adăuga membri în echipă?",
    answer: "Accesează secțiunea 'Personal' din meniul lateral, apoi click pe 'Membru Nou'. Completează formularul cu informațiile necesare (nume, email, telefon, specializare) și salvează."
  },
  {
    question: "Cum gestionez serviciile oferite?",
    answer: "În secțiunea 'Servicii' poți adăuga, edita sau șterge serviciile tale. Fiecare serviciu poate avea nume, descriere, durată, preț și categorie."
  },
  {
    question: "Cum schimb planul de abonament?",
    answer: "Mergi la secțiunea 'Billing' din meniul lateral, apoi click pe 'Schimbă Planul' pentru a vedea opțiunile disponibile și a selecta planul care ți se potrivește."
  },
  {
    question: "Cum pot exporta rapoartele?",
    answer: "În secțiunea 'Dashboard', găsești butonul 'Export' lângă grafice și statistici. Poți exporta datele în format CSV sau PDF."
  },
  {
    question: "Cum configurez notificările?",
    answer: "Accesează 'Setări' din meniul lateral, apoi tab-ul 'Notificări'. Aici poți activa/dezactiva notificările prin email, SMS sau push pentru diverse evenimente."
  },
  {
    question: "Ce înseamnă 'Multi-tenancy'?",
    answer: "Multi-tenancy înseamnă că fiecare business are propriul spațiu izolat pe platformă, cu proprii clienți, servicii și programări. Datele sunt complet separate între businesses."
  },
  {
    question: "Cum pot integra API-uri externe?",
    answer: "În secțiunea Super Admin > API Keys, poți adăuga chei API pentru integrări cu servicii externe precum Stripe (plăți), SendGrid (email), Twilio (SMS) și Google Maps."
  },
];

const resources = [
  {
    title: "Ghid de Început Rapid",
    description: "Învață bazele platformei în 5 minute",
    icon: Book,
    color: "from-blue-500 to-cyan-500",
    link: "#"
  },
  {
    title: "Video Tutorials",
    description: "Urmărește tutoriale video pas cu pas",
    icon: Video,
    color: "from-purple-500 to-pink-500",
    link: "#"
  },
  {
    title: "Documentație Completă",
    description: "Documentație tehnică detaliată",
    icon: FileText,
    color: "from-green-500 to-emerald-500",
    link: "#"
  },
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [contactForm, setContactForm] = useState({
    subject: '',
    message: '',
  });
  const { toast } = useToast();

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmitContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.subject || !contactForm.message) {
      toast({
        title: "Eroare",
        description: "Te rog completează toate câmpurile",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Mesaj trimis!",
      description: "Echipa noastră va răspunde în cel mai scurt timp.",
    });

    setContactForm({ subject: '', message: '' });
  };

  return (
    <div className="flex flex-1 flex-col gap-8 p-4 md:p-8 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/20 dark:to-purple-950/20 min-h-screen">
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-500/10 via-blue-500/10 to-slate-600/10 rounded-3xl blur-3xl" />
        <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-200/50 dark:border-slate-800/50 p-8 shadow-2xl">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-600 to-blue-600 rounded-2xl blur-xl opacity-50" />
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-600 to-blue-600 flex items-center justify-center text-white shadow-xl">
                <HelpCircle className="w-8 h-8" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-black bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mb-2">
                Centru de Ajutor
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-lg">
                Găsește răspunsuri rapide la întrebările tale
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <Card className="p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 shadow-xl">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            type="text"
            placeholder="Caută în întrebări frecvente..."
            className="pl-12 h-14 rounded-2xl text-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </Card>

      {/* Quick Contact */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-2 border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 shadow-xl transition-all duration-300 cursor-pointer">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-slate-600 to-blue-600 flex items-center justify-center text-white mb-4">
              <MessageCircle className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-slate-800 dark:text-slate-200">Live Chat</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Discută cu echipa noastră în timp real</p>
            <Badge className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-0">
              Online Acum
            </Badge>
          </div>
        </Card>

        <Card className="p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-2 border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 shadow-xl transition-all duration-300 cursor-pointer">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-slate-600 to-blue-600 flex items-center justify-center text-white mb-4">
              <Mail className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-slate-800 dark:text-slate-200">Email Support</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">support@biznizz.eu</p>
            <p className="text-xs text-slate-500">Răspuns în 24h</p>
          </div>
        </Card>

        <Card className="p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-2 border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 shadow-xl transition-all duration-300 cursor-pointer">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-slate-600 to-blue-600 flex items-center justify-center text-white mb-4">
              <Phone className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-slate-800 dark:text-slate-200">Telefon</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">+40 XXX XXX XXX</p>
            <p className="text-xs text-slate-500">Lun-Vin: 9:00-18:00</p>
          </div>
        </Card>
      </div>

      {/* Resources */}
      <div>
        <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-200">Resurse Utile</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {resources.map((resource, idx) => (
            <Card key={idx} className="p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 hover:border-slate-400 dark:hover:border-slate-600 shadow-xl transition-all duration-300 group cursor-pointer">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${resource.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                <resource.icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-slate-800 dark:text-slate-200">{resource.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{resource.description}</p>
              <Button variant="ghost" className="p-0 h-auto font-semibold text-slate-600 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300">
                Citește mai mult <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </Card>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <Card className="p-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-200">Întrebări Frecvente</h2>
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-12 text-slate-600 dark:text-slate-400">
            <Search className="w-16 h-16 mx-auto mb-4 text-slate-400" />
            <p className="text-lg font-semibold mb-2">Nu s-au găsit rezultate</p>
            <p>Încearcă un alt termen de căutare</p>
          </div>
        ) : (
          <Accordion type="single" collapsible className="space-y-4">
            {filteredFaqs.map((faq, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`} className="border border-slate-200 dark:border-slate-800 rounded-xl px-6 bg-slate-50 dark:bg-slate-800/50">
                <AccordionTrigger className="text-left font-semibold hover:no-underline text-slate-800 dark:text-slate-200">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 dark:text-slate-400">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </Card>

      {/* Contact Form */}
      <Card className="p-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-200">Trimite-ne un Mesaj</h2>
        <form onSubmit={handleSubmitContact} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="subject" className="text-slate-700 dark:text-slate-300">Subiect *</Label>
            <Input
              id="subject"
              placeholder="Ex: Problemă cu programările"
              className="h-12 rounded-xl"
              value={contactForm.subject}
              onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message" className="text-slate-700 dark:text-slate-300">Mesaj *</Label>
            <Textarea
              id="message"
              placeholder="Descrie problema sau întrebarea ta..."
              className="rounded-xl min-h-[150px]"
              value={contactForm.message}
              onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
            />
          </div>
          <Button type="submit" className="bg-gradient-to-r from-slate-600 to-blue-600 hover:from-slate-700 hover:to-blue-700 h-12 px-8">
            <Send className="w-4 h-4 mr-2" />
            Trimite Mesaj
          </Button>
        </form>
      </Card>
    </div>
  )
}



