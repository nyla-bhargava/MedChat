
import React from 'react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ThemeToggle from './ThemeToggle';
import { User, X, Menu, MessageCircle, Calendar, Send } from 'lucide-react';
import { toast } from "@/components/ui/sonner";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  previousQueries: string[];
  onSelectQuery: (query: string) => void;
}

// Health topics that users might be interested in
const SUGGESTED_TOPICS = [
  "Common cold symptoms",
  "Headache causes and remedies",
  "Healthy sleep habits",
  "COVID-19 prevention",
  "Seasonal allergies",
  "Nutrition basics",
  "Exercise recommendations",
  "Stress management"
];

// Age range options
const AGE_RANGES = [
  "Child (0-12)",
  "Teen (13-17)",
  "Adult (18-64)",
  "Senior (65+)"
];

const Sidebar = ({ isOpen, onClose, previousQueries, onSelectQuery }: SidebarProps) => {
  const [gender, setGender] = React.useState<string | null>(null);
  const [ageRange, setAgeRange] = React.useState<string | null>(null);

  const handleContextSave = () => {
    localStorage.setItem('medibot-user-gender', gender || '');
    localStorage.setItem('medibot-user-age', ageRange || '');
    
    // Show toast notification when context is saved
    toast.success("Patient context saved successfully");
  };

  React.useEffect(() => {
    // Try to get from new keys first, then fall back to old keys if needed
    const savedGender = localStorage.getItem('medibot-user-gender') || localStorage.getItem('medgem-user-gender');
    const savedAge = localStorage.getItem('medibot-user-age') || localStorage.getItem('medgem-user-age');
    
    if (savedGender) setGender(savedGender);
    if (savedAge) setAgeRange(savedAge);
    
    // Clean up old keys if they exist
    if (localStorage.getItem('medgem-user-gender')) {
      localStorage.removeItem('medgem-user-gender');
    }
    if (localStorage.getItem('medgem-user-age')) {
      localStorage.removeItem('medgem-user-age');
    }
  }, []);
  
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed md:sticky top-0 left-0 z-50 h-full md:h-screen w-[280px] bg-sidebar text-sidebar-foreground transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} border-r border-sidebar-border`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-lg">MediBot</span>
              <span className="bg-medical-purple text-white text-xs px-2 py-0.5 rounded-full">
                Beta
              </span>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden"
                onClick={onClose}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* User context section */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium flex items-center gap-1">
                <User className="h-4 w-4" />
                Patient Context (Optional)
              </h3>
              
              <div className="space-y-2 text-sm">
                <div>
                  <label className="block text-xs mb-1">Gender</label>
                  <div className="flex gap-2">
                    <Button 
                      variant={gender === 'male' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setGender('male')}
                      className="flex-1 text-xs"
                    >
                      Male
                    </Button>
                    <Button 
                      variant={gender === 'female' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setGender('female')}
                      className="flex-1 text-xs"
                    >
                      Female
                    </Button>
                    <Button 
                      variant={gender === 'other' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setGender('other')}
                      className="flex-1 text-xs"
                    >
                      Other
                    </Button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs mb-1">Age Range</label>
                  <div className="grid grid-cols-2 gap-2">
                    {AGE_RANGES.map((range) => (
                      <Button 
                        key={range}
                        variant={ageRange === range ? 'default' : 'outline'} 
                        size="sm"
                        onClick={() => setAgeRange(range)}
                        className="text-xs"
                      >
                        {range}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <Button 
                  size="sm" 
                  className="w-full mt-1"
                  onClick={handleContextSave}
                >
                  Save Context
                </Button>
              </div>
            </div>
            
            <Separator />
            
            {/* Previous queries */}
            {previousQueries.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" />
                  Recent Questions
                </h3>
                <div className="space-y-1">
                  {previousQueries.map((query, index) => (
                    <Button 
                      key={index}
                      variant="ghost" 
                      size="sm" 
                      className="w-full justify-start text-xs truncate h-auto py-1.5 px-2"
                      onClick={() => onSelectQuery(query)}
                    >
                      {query}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Suggested topics */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Suggested Topics
              </h3>
              <div className="space-y-1">
                {SUGGESTED_TOPICS.map((topic, index) => (
                  <Button 
                    key={index}
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start text-xs h-auto py-1.5 px-2"
                    onClick={() => onSelectQuery(topic)}
                  >
                    {topic}
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Send to Doctor */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium flex items-center gap-1">
                <Send className="h-4 w-4" />
                Share & Contact
              </h3>
              <Button 
                variant="default"
                size="sm"
                className="w-full bg-medical-blue hover:bg-medical-blue/90"
              >
                Send to Doctor
              </Button>
              <p className="text-xs text-muted-foreground">
                Export this conversation to share with your healthcare provider.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
