
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Help, Shield, AlertCircle, Phone, Mail, MessageCircle, Accessibility } from 'lucide-react';
import { FOCUS_STYLES, TOUCH_TARGET_SIZE } from '@/utils/accessibility';

const AccessibilityHelper: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const helpOptions = [
    {
      title: 'Report Harmful Content',
      description: 'Found something concerning? Report it immediately for review.',
      icon: <Shield className="h-5 w-5" />,
      action: 'report',
      urgent: true,
    },
    {
      title: 'Get Support',
      description: 'Need help using the platform or understanding results?',
      icon: <Help className="h-5 w-5" />,
      action: 'support',
      urgent: false,
    },
    {
      title: 'Crisis Resources',
      description: 'Immediate support for mental health or safety concerns.',
      icon: <Phone className="h-5 w-5" />,
      action: 'crisis',
      urgent: true,
    },
    {
      title: 'Accessibility Features',
      description: 'Learn about built-in accessibility features and shortcuts.',
      icon: <Accessibility className="h-5 w-5" />,
      action: 'accessibility',
      urgent: false,
    },
  ];

  const handleAction = (action: string) => {
    switch (action) {
      case 'report':
        // Focus on main content area for reporting
        document.getElementById('demo')?.focus();
        break;
      case 'support':
        window.open('mailto:support@safescape.ai?subject=Support Request', '_blank');
        break;
      case 'crisis':
        // Show crisis resources
        alert('Crisis Support:\n• National Suicide Prevention Lifeline: 988\n• Crisis Text Line: Text HOME to 741741\n• Emergency Services: 911');
        break;
      case 'accessibility':
        // Show accessibility shortcuts
        alert('Accessibility Shortcuts:\n• Tab: Navigate between elements\n• Enter/Space: Activate buttons\n• Escape: Close dialogs\n• Alt + H: Open this help menu');
        break;
    }
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Help Button - Always Visible */}
      <div className="fixed bottom-6 left-6 z-50">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              size="lg"
              className={`
                ${TOUCH_TARGET_SIZE.recommended} 
                ${FOCUS_STYLES.ring}
                rounded-full shadow-lg hover:shadow-xl transition-all duration-200
                bg-primary hover:bg-primary/90 text-primary-foreground
                border-2 border-white/20
              `}
              aria-label="Get help and support - Always available"
            >
              <Help className="h-6 w-6" />
              <span className="sr-only">Help & Support</span>
            </Button>
          </DialogTrigger>
          
          <DialogContent 
            className="max-w-2xl max-h-[80vh] overflow-y-auto"
            aria-describedby="help-description"
          >
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                <Help className="h-6 w-6 text-primary" />
                Help & Support
              </DialogTitle>
              <DialogDescription id="help-description" className="text-lg">
                Get immediate assistance, report concerns, or access support resources. 
                All options are designed to be accessible and user-friendly.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 mt-6">
              {helpOptions.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAction(option.action)}
                  className={`
                    ${TOUCH_TARGET_SIZE.recommended}
                    ${FOCUS_STYLES.ring}
                    p-4 text-left rounded-lg border-2 transition-all duration-200
                    hover:bg-muted/50 hover:border-primary/30
                    ${option.urgent ? 'border-red-200 bg-red-50/50' : 'border-border bg-card'}
                  `}
                  aria-describedby={`help-option-${index}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`
                      p-2 rounded-lg flex-shrink-0
                      ${option.urgent ? 'bg-red-100 text-red-700' : 'bg-primary/10 text-primary'}
                    `}>
                      {option.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg">{option.title}</h3>
                        {option.urgent && (
                          <Badge variant="destructive" className="text-xs">
                            Urgent
                          </Badge>
                        )}
                      </div>
                      <p id={`help-option-${index}`} className="text-muted-foreground">
                        {option.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-muted/30 rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Accessibility className="h-4 w-4" />
                Accessibility Information
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• This platform is designed to meet WCAG 2.2 AA standards</li>
                <li>• Use Tab to navigate, Enter/Space to activate</li>
                <li>• Screen reader compatible with proper headings and labels</li>
                <li>• High contrast mode and reduced motion are supported</li>
                <li>• All content can be zoomed up to 200% without loss of functionality</li>
              </ul>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Keyboard shortcut listener */}
      <div 
        className="sr-only"
        tabIndex={-1}
        onKeyDown={(e) => {
          if (e.altKey && e.key === 'h') {
            e.preventDefault();
            setIsOpen(true);
          }
        }}
      />
    </>
  );
};

export default AccessibilityHelper;
