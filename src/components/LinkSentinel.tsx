import { useState } from "react";
import { Shield, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

interface LinkSentinelProps {
  onAnalyzeLink?: (url: string) => void;
}

export const LinkSentinel = ({ onAnalyzeLink }: LinkSentinelProps) => {
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const mockPosts = [
    {
      id: 1,
      author: "TechDeals India",
      avatar: "🛍️",
      content: "🔥 URGENT! iPhone 15 Pro at 90% discount! Limited stock. Click here before it's gone!",
      link: "bit.ly/iphone-deal-999",
      verified: false
    },
    {
      id: 2,
      author: "Government Updates",
      avatar: "🏛️",
      content: "New PM scheme: ₹5000 direct transfer to all citizens. Register with Aadhaar now:",
      link: "gov-scheme-register.com/claim",
      verified: false
    },
    {
      id: 3,
      author: "Banking Alert",
      avatar: "🏦",
      content: "Your account will be blocked. Verify KYC immediately to avoid suspension.",
      link: "verify-kyc-urgent.net/update",
      verified: false
    }
  ];

  const handleLinkClick = (e: React.MouseEvent, url: string) => {
    e.preventDefault();
    if (onAnalyzeLink) {
      onAnalyzeLink(`https://${url}`);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Link Sentinel - Social Media Protection (Demo)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Hover over links to see AI SafeScape protection in action. This simulates how our browser extension works.
        </p>
        
        <div className="space-y-3">
          {mockPosts.map((post) => (
            <Card key={post.id} className="border-l-4 border-l-orange-500">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{post.avatar}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{post.author}</span>
                      {!post.verified && (
                        <Badge variant="outline" className="text-xs">
                          Unverified
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm mb-2">{post.content}</p>
                    <div className="flex items-center gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <a
                              href="#"
                              onClick={(e) => handleLinkClick(e, post.link)}
                              className="text-blue-600 hover:underline text-sm inline-flex items-center gap-1 relative"
                              onMouseEnter={() => setHoveredLink(post.link)}
                              onMouseLeave={() => setHoveredLink(null)}
                            >
                              {post.link}
                              <ExternalLink className="h-3 w-3" />
                              {hoveredLink === post.link && (
                                <Shield className="h-4 w-4 text-orange-500 animate-pulse absolute -right-6" />
                              )}
                            </a>
                          </TooltipTrigger>
                          {hoveredLink === post.link && (
                            <TooltipContent side="top" className="max-w-xs">
                              <div className="flex items-start gap-2">
                                <Shield className="h-4 w-4 text-orange-500 flex-shrink-0 mt-0.5" />
                                <div>
                                  <p className="font-semibold text-xs mb-1">
                                    ⚠️ AI SafeScape Sentinel Warning
                                  </p>
                                  <p className="text-xs">
                                    This link is unverified and shows suspicious patterns. Click to perform a full analysis with AI SafeScape.
                                  </p>
                                </div>
                              </div>
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
          <p className="text-xs text-blue-800 dark:text-blue-200">
            <strong>💡 How Link Sentinel Works:</strong> When installed as a browser extension, AI SafeScape will automatically monitor links on social media platforms and warn you about potentially dangerous content before you click.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};