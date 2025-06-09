
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  Users, 
  Heart, 
  BookOpen, 
  Scale, 
  Target,
  Globe,
  Lightbulb,
  UserCheck,
  Building2,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

interface SDGFeature {
  title: string;
  description: string;
  impact: string;
  metrics: {
    label: string;
    value: number;
  }[];
}

interface SDGGoal {
  id: number;
  title: string;
  icon: React.ReactNode;
  color: string;
  alignment: 'primary' | 'secondary';
  features: SDGFeature[];
  targets: string[];
}

const UNSDGAlignment: React.FC = () => {
  const sdgGoals: SDGGoal[] = [
    {
      id: 16,
      title: "Peace, Justice, and Strong Institutions",
      icon: <Scale className="h-6 w-6" />,
      color: "bg-blue-600",
      alignment: 'primary',
      features: [
        {
          title: "Online Harm Detection",
          description: "AI-powered detection of harassment, cyberbullying, and discriminatory content",
          impact: "Reduces forms of violence and promotes non-discriminatory policies in digital spaces",
          metrics: [
            { label: "Harm Detection Accuracy", value: 94 },
            { label: "Response Time Improvement", value: 85 },
            { label: "Community Safety Index", value: 91 }
          ]
        },
        {
          title: "Misinformation Prevention",
          description: "Real-time fact-checking and content verification systems",
          impact: "Strengthens information integrity and promotes transparent institutions",
          metrics: [
            { label: "Misinformation Detection", value: 89 },
            { label: "Source Verification", value: 92 },
            { label: "Public Trust Score", value: 88 }
          ]
        },
        {
          title: "Fraud Detection",
          description: "Advanced algorithms to identify and prevent online fraud and scams",
          impact: "Protects vulnerable populations and ensures equal access to justice",
          metrics: [
            { label: "Fraud Prevention Rate", value: 96 },
            { label: "Financial Protection", value: 93 },
            { label: "User Confidence", value: 90 }
          ]
        }
      ],
      targets: [
        "16.1: Reduce violence and related death rates",
        "16.B: Promote non-discriminatory laws and policies",
        "16.10: Ensure public access to information"
      ]
    },
    {
      id: 4,
      title: "Quality Education",
      icon: <BookOpen className="h-6 w-6" />,
      color: "bg-red-600",
      alignment: 'secondary',
      features: [
        {
          title: "Safe Learning Environments",
          description: "Creating harassment-free online educational spaces",
          impact: "Enables inclusive and equitable quality education for all learners",
          metrics: [
            { label: "Educational Platform Safety", value: 95 },
            { label: "Student Engagement Increase", value: 78 },
            { label: "Teacher Confidence", value: 87 }
          ]
        },
        {
          title: "Content Moderation for EdTech",
          description: "Automated moderation systems for educational platforms",
          impact: "Ensures safe, conducive learning environments free from online harm",
          metrics: [
            { label: "Content Filtering Accuracy", value: 93 },
            { label: "Learning Time Protection", value: 89 },
            { label: "Platform Usability", value: 91 }
          ]
        }
      ],
      targets: [
        "4.7: Promote sustainable development education",
        "4.A: Build and upgrade education facilities",
        "4.C: Increase qualified teachers"
      ]
    },
    {
      id: 5,
      title: "Gender Equality",
      icon: <Users className="h-6 w-6" />,
      color: "bg-orange-600",
      alignment: 'secondary',
      features: [
        {
          title: "Gender-Based Harassment Detection",
          description: "Specialized algorithms to detect and prevent gender-based online violence",
          impact: "Eliminates discrimination and promotes equal participation in digital spaces",
          metrics: [
            { label: "Gender-Based Harm Detection", value: 92 },
            { label: "Women's Digital Participation", value: 84 },
            { label: "Safe Space Creation", value: 88 }
          ]
        },
        {
          title: "Equal Voice Amplification",
          description: "Ensuring equal representation and voice in online discussions",
          impact: "Promotes women's full participation in decision-making processes",
          metrics: [
            { label: "Voice Equality Index", value: 86 },
            { label: "Platform Representation", value: 82 },
            { label: "Leadership Opportunities", value: 79 }
          ]
        }
      ],
      targets: [
        "5.1: End discrimination against women and girls",
        "5.2: Eliminate violence against women",
        "5.C: Adopt sound policies for gender equality"
      ]
    },
    {
      id: 3,
      title: "Good Health and Well-being",
      icon: <Heart className="h-6 w-6" />,
      color: "bg-green-600",
      alignment: 'secondary',
      features: [
        {
          title: "Mental Health Protection",
          description: "Detecting content that may harm psychological well-being",
          impact: "Promotes mental health and prevents psychological harm from online interactions",
          metrics: [
            { label: "Mental Health Risk Reduction", value: 87 },
            { label: "Positive Content Promotion", value: 83 },
            { label: "User Well-being Index", value: 90 }
          ]
        },
        {
          title: "Self-Harm Prevention",
          description: "Early detection and intervention for self-harm related content",
          impact: "Provides timely support and reduces risk of harm to vulnerable individuals",
          metrics: [
            { label: "Risk Intervention Rate", value: 94 },
            { label: "Support Connection Success", value: 89 },
            { label: "Crisis Prevention", value: 92 }
          ]
        }
      ],
      targets: [
        "3.4: Reduce premature mortality from mental disorders",
        "3.5: Strengthen prevention of substance abuse",
        "3.D: Strengthen capacity for health risk reduction"
      ]
    }
  ];

  const getAlignmentColor = (alignment: 'primary' | 'secondary') => {
    return alignment === 'primary' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800';
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-4">
          UN Sustainable Development Goals
        </span>
        <h2 className="text-3xl font-bold mb-4">AI-SafeScape's Contribution to Global Development</h2>
        <p className="text-muted-foreground max-w-4xl mx-auto mb-8">
          Our AI-powered platform directly contributes to multiple United Nations Sustainable Development Goals, 
          creating safer digital spaces that enable sustainable development across education, justice, equality, and well-being.
        </p>
      </div>

      {/* SDG Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {sdgGoals.map((goal) => (
          <Card key={goal.id} className="relative overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${goal.color} text-white`}>
                  {goal.icon}
                </div>
                <div>
                  <Badge variant={goal.alignment === 'primary' ? 'default' : 'secondary'} className="text-xs">
                    SDG {goal.id}
                  </Badge>
                </div>
              </div>
              <CardTitle className="text-sm leading-tight">{goal.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge className={getAlignmentColor(goal.alignment)}>
                {goal.alignment === 'primary' ? 'Primary Alignment' : 'Secondary Alignment'}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="primary" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="primary">Primary SDG Alignment</TabsTrigger>
          <TabsTrigger value="secondary">Secondary SDG Alignment</TabsTrigger>
        </TabsList>

        <TabsContent value="primary" className="space-y-6">
          {sdgGoals
            .filter(goal => goal.alignment === 'primary')
            .map((goal) => (
              <Card key={goal.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${goal.color} text-white`}>
                      {goal.icon}
                    </div>
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        SDG {goal.id}: {goal.title}
                        <Badge className="bg-blue-100 text-blue-800">Primary Focus</Badge>
                      </CardTitle>
                      <CardDescription className="mt-2">
                        AI-SafeScape's core mission directly supports this goal through comprehensive online safety measures.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Targets */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Key Targets Addressed
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {goal.targets.map((target, index) => (
                        <div key={index} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>{target}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-4">
                    <h4 className="font-semibold">Contributing Features</h4>
                    {goal.features.map((feature, index) => (
                      <Card key={index} className="bg-muted/30">
                        <CardContent className="pt-4">
                          <div className="space-y-4">
                            <div>
                              <h5 className="font-medium flex items-center gap-2">
                                <Lightbulb className="h-4 w-4 text-yellow-600" />
                                {feature.title}
                              </h5>
                              <p className="text-sm text-muted-foreground mt-1">{feature.description}</p>
                            </div>
                            
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                              <p className="text-sm font-medium text-blue-800 dark:text-blue-200 flex items-center gap-2">
                                <ArrowRight className="h-4 w-4" />
                                Impact: {feature.impact}
                              </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {feature.metrics.map((metric, metricIndex) => (
                                <div key={metricIndex} className="space-y-2">
                                  <div className="flex justify-between text-sm">
                                    <span>{metric.label}</span>
                                    <span className="font-medium">{metric.value}%</span>
                                  </div>
                                  <Progress value={metric.value} className="h-2" />
                                </div>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="secondary" className="space-y-6">
          {sdgGoals
            .filter(goal => goal.alignment === 'secondary')
            .map((goal) => (
              <Card key={goal.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${goal.color} text-white`}>
                      {goal.icon}
                    </div>
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        SDG {goal.id}: {goal.title}
                        <Badge className="bg-purple-100 text-purple-800">Indirect Contribution</Badge>
                      </CardTitle>
                      <CardDescription className="mt-2">
                        AI-SafeScape enables progress toward this goal by creating safer digital environments.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Targets */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Supporting Targets
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {goal.targets.map((target, index) => (
                        <div key={index} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                          <span>{target}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-4">
                    <h4 className="font-semibold">Enabling Features</h4>
                    {goal.features.map((feature, index) => (
                      <Card key={index} className="bg-muted/30">
                        <CardContent className="pt-4">
                          <div className="space-y-4">
                            <div>
                              <h5 className="font-medium flex items-center gap-2">
                                <UserCheck className="h-4 w-4 text-purple-600" />
                                {feature.title}
                              </h5>
                              <p className="text-sm text-muted-foreground mt-1">{feature.description}</p>
                            </div>
                            
                            <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                              <p className="text-sm font-medium text-purple-800 dark:text-purple-200 flex items-center gap-2">
                                <ArrowRight className="h-4 w-4" />
                                Enabling Impact: {feature.impact}
                              </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {feature.metrics.map((metric, metricIndex) => (
                                <div key={metricIndex} className="space-y-2">
                                  <div className="flex justify-between text-sm">
                                    <span>{metric.label}</span>
                                    <span className="font-medium">{metric.value}%</span>
                                  </div>
                                  <Progress value={metric.value} className="h-2" />
                                </div>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>
      </Tabs>

      {/* Multi-SDG Alignment Summary */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-6 w-6 text-blue-600" />
            Multi-SDG Alignment Impact
          </CardTitle>
          <CardDescription>
            AI-SafeScape's comprehensive approach creates synergistic effects across multiple development goals
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Interconnected Benefits</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  Safer online spaces enable better educational outcomes and gender equality
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  Mental health protection supports learning and social participation
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  Justice and institutional strength create foundations for all other goals
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  Technology solutions scale impact across diverse communities globally
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Global Development Impact</h4>
              <div className="space-y-3">
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">4+</div>
                  <div className="text-sm text-muted-foreground">SDGs Directly Supported</div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">12</div>
                  <div className="text-sm text-muted-foreground">Specific Targets Addressed</div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">100%</div>
                  <div className="text-sm text-muted-foreground">Technology-Enabled Solutions</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UNSDGAlignment;
