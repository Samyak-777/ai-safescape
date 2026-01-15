import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Search, Link2Off, Shield, CheckCircle, MapPin, AlertTriangle, Brain, Settings } from 'lucide-react';

interface MissionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MissionModal: React.FC<MissionModalProps> = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold mb-2">
            Our Mission: Tackling Misinformation Head-On
          </DialogTitle>
          <DialogDescription className="text-base">
            Building digital resilience for India through transparent, educational AI
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Section 1: The Core Problem */}
          <div className="glass-card rounded-xl p-6 border border-primary/10">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 text-primary w-12 h-12 rounded-xl flex items-center justify-center shrink-0">
                <MapPin size={24} />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">The Core Problem We Address</h3>
                <p className="text-muted-foreground leading-relaxed">
                  The rapid spread of fake news in India is a "digital contagion" leading to social unrest, health crises, and financial scams. We directly tackle the challenge of empowering users to fight back.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: The Root Cause */}
          <div className="glass-card rounded-xl p-6 border border-destructive/10">
            <div className="flex items-start gap-4">
              <div className="bg-destructive/10 text-destructive w-12 h-12 rounded-xl flex items-center justify-center shrink-0">
                <Link2Off size={24} />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">The Root Cause: Why Existing Solutions Fall Apart</h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  Most tools fail because they are either too slow, too complex, or act as a "black box," leaving users uninformed.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <AlertTriangle size={18} className="text-destructive shrink-0 mt-1" />
                    <div>
                      <span className="font-medium">High Friction:</span>
                      <span className="text-muted-foreground"> Verifying a link requires leaving your current app, breaking the user's flow.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <AlertTriangle size={18} className="text-destructive shrink-0 mt-1" />
                    <div>
                      <span className="font-medium">Lack of Education:</span>
                      <span className="text-muted-foreground"> Simple "fake/real" labels don't teach users how to spot misinformation in the future.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <AlertTriangle size={18} className="text-destructive shrink-0 mt-1" />
                    <div>
                      <span className="font-medium">Static & Outdated:</span>
                      <span className="text-muted-foreground"> Rule-based systems cannot keep up with the dynamic, evolving nature of online threats.</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 3: Our Solution */}
          <div className="glass-card rounded-xl p-6 border border-accent/10">
            <div className="flex items-start gap-4">
              <div className="bg-accent/10 text-accent w-12 h-12 rounded-xl flex items-center justify-center shrink-0">
                <Shield size={24} />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">Our Solution: An Intelligent & Educational Shield</h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  AI SafeScape is designed to address these root causes head-on. We don't just detect; we educate and empower.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle size={18} className="text-accent shrink-0 mt-1" />
                    <div>
                      <span className="font-medium">Proactive & In-Context:</span>
                      <span className="text-muted-foreground"> Our planned browser extension brings verification directly into the user's workflow, removing friction.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle size={18} className="text-accent shrink-0 mt-1" />
                    <div>
                      <span className="font-medium">Transparent by Design:</span>
                      <span className="text-muted-foreground"> We provide a detailed "Reasoning Process" for every analysis, teaching users the "why" behind the verdict.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle size={18} className="text-accent shrink-0 mt-1" />
                    <div>
                      <span className="font-medium">Dynamic & Scalable:</span>
                      <span className="text-muted-foreground"> Our Hybrid AI architecture (RAG + LLM) is built to adapt to new threats and scale to millions of users, ensuring long-term effectiveness.</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 4: Hackathon Alignment */}
          <div className="glass-card rounded-xl p-6 border border-primary/10">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 text-primary w-12 h-12 rounded-xl flex items-center justify-center shrink-0">
                <Settings size={24} />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">Built on Microsoft Azure</h3>
                <p className="text-muted-foreground mb-3 leading-relaxed">
                  Born from a vision to secure India's digital future, AI-SafeScape leverages the power of the Microsoft Cloud to provide enterprise-grade security to the common citizen.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Our focus on detailed reasoning, empathetic support via our AI Assistant, and a transparent, scalable architecture is designed to build the digital resilience India needs. We use Azure OpenAI Service for advanced content analysis and Azure AI Search for real-time threat verification.
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MissionModal;
