import React, { useState, useEffect } from "react";
import { Bug, CheckCircle2, Loader2, Info } from "lucide-react";
import { submitBugReport } from "~/services/bugReportService";
import type { BugReport } from "~/types/bugReport";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "~/components/ui/collapsible";

const CATEGORIES = [
  "Audio Issue",
  "Video Issue",
  "AI Response Issue",
  "Interview Session Issue",
  "Login / Authentication",
  "Performance",
  "UI / Design",
  "Billing",
  "Other"
];

const SEVERITIES = [
  "Minor",
  "Moderate",
  "Major",
  "Critical"
];

export default function ReportBug() {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    severity: "",
    description: "",
    stepsToReproduce: "",
  });
  
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [metadata, setMetadata] = useState<BugReport['metadata']>({
    browser: "",
    userAgent: "",
    currentUrl: "",
    screenResolution: "",
    timestamp: "",
  });

  useEffect(() => {
    // Auto-capture metadata
    setMetadata({
      browser: getBrowserName(),
      userAgent: navigator.userAgent,
      currentUrl: window.location.href,
      screenResolution: `${window.innerWidth}x${window.innerHeight}`,
      timestamp: new Date().toISOString(),
      // Mocked user/session IDs for now
      userId: "user_123",
      interviewSessionId: "session_456"
    });
  }, []);

  const getBrowserName = () => {
    const agent = window.navigator.userAgent.toLowerCase();
    switch (true) {
      case agent.indexOf("edge") > -1: return "Edge";
      case agent.indexOf("edg") > -1: return "Edge";
      case agent.indexOf("opr") > -1 && !!(window as any).opr: return "Opera";
      case agent.indexOf("chrome") > -1 && !!(window as any).chrome: return "Chrome";
      case agent.indexOf("trident") > -1: return "IE";
      case agent.indexOf("firefox") > -1: return "Firefox";
      case agent.indexOf("safari") > -1: return "Safari";
      default: return "Other";
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file type
      if (!['image/png', 'image/jpeg', 'image/jpg', 'image/webp'].includes(file.type)) {
        alert("Please upload a valid image (PNG, JPG, JPEG, WEBP)");
        return;
      }
      setScreenshot(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.severity) newErrors.severity = "Severity is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      const payload: BugReport = {
        ...formData,
        screenshot,
        metadata
      };
      
      await submitBugReport(payload);
      setIsSuccess(true);
    } catch (error) {
      console.error("Failed to submit bug report", error);
      alert("Failed to submit bug report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      category: "",
      severity: "",
      description: "",
      stepsToReproduce: "",
    });
    setScreenshot(null);
    setPreviewUrl(null);
    setIsSuccess(false);
    setErrors({});
  };

  if (isSuccess) {
    return (
      <div className="flex-1 p-8 pt-6 max-w-4xl mx-auto w-full">
        <Card className="text-center p-8 border-green-200 bg-green-50/50 dark:bg-green-900/10 dark:border-green-900/50">
          <CardContent className="pt-6">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-green-900 dark:text-green-400 mb-2">
              Bug Report Submitted
            </h2>
            <p className="text-green-700 dark:text-green-500/80 mb-6">
              Thank you for helping improve Interview Royale. <br />
              Your report has been recorded and will be reviewed.
            </p>
            <Button onClick={resetForm} variant="outline" className="border-green-200 hover:bg-green-100 dark:border-green-800 dark:hover:bg-green-900/50">
              Submit Another Report
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 pt-6 max-w-5xl mx-auto w-full">
      <div className="flex items-center space-x-2 mb-6">
        <Bug className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Report a Bug</h1>
          <p className="text-muted-foreground">
            Help us improve Interview Royale by reporting issues you encounter.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <CardHeader>
                <CardTitle>Bug Details</CardTitle>
                <CardDescription>
                  Please provide as much information as possible to help us reproduce and fix the issue.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-0">
                <div className="space-y-2">
                  <Label htmlFor="title">Bug Title <span className="text-destructive">*</span></Label>
                  <Input 
                    id="title" 
                    name="title" 
                    placeholder="Brief summary of the issue" 
                    value={formData.title}
                    onChange={handleInputChange}
                    className={errors.title ? "border-destructive" : ""}
                  />
                  {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category <span className="text-destructive">*</span></Label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className={`flex h-10 w-full items-center justify-between rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.category ? "border-destructive" : "border-input"}`}
                    >
                      <option value="" disabled>Select a category</option>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    {errors.category && <p className="text-xs text-destructive">{errors.category}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="severity">Severity <span className="text-destructive">*</span></Label>
                    <select
                      id="severity"
                      name="severity"
                      value={formData.severity}
                      onChange={handleInputChange}
                      className={`flex h-10 w-full items-center justify-between rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.severity ? "border-destructive" : "border-input"}`}
                    >
                      <option value="" disabled>Select severity</option>
                      {SEVERITIES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {errors.severity && <p className="text-xs text-destructive">{errors.severity}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description <span className="text-destructive">*</span></Label>
                  <Textarea 
                    id="description" 
                    name="description" 
                    placeholder="What happened? What did you expect to happen?" 
                    rows={4}
                    value={formData.description}
                    onChange={handleInputChange}
                    className={errors.description ? "border-destructive" : ""}
                  />
                  {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stepsToReproduce">Steps to Reproduce (Optional)</Label>
                  <Textarea 
                    id="stepsToReproduce" 
                    name="stepsToReproduce" 
                    placeholder={"1. Go to...\n2. Click on...\n3. See error..."}
                    rows={3}
                    value={formData.stepsToReproduce}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="screenshot">Screenshot (Optional)</Label>
                  <Input 
                    id="screenshot" 
                    type="file" 
                    accept="image/png, image/jpeg, image/jpg, image/webp" 
                    onChange={handleFileChange}
                    className="cursor-pointer"
                  />
                  {previewUrl && (
                    <div className="mt-2 rounded-md border overflow-hidden max-w-sm">
                      <img src={previewUrl} alt="Screenshot preview" className="w-full h-auto object-contain" />
                    </div>
                  )}
                </div>

                <Collapsible className="border rounded-md">
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-4 font-medium text-sm hover:bg-muted/50 transition-colors">
                    Technical Information
                    <span className="text-xs text-muted-foreground">(Auto-captured)</span>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="p-4 pt-0 border-t">
                    <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs mt-4">
                      <div className="font-semibold text-muted-foreground">Browser:</div>
                      <div>{metadata.browser}</div>
                      <div className="font-semibold text-muted-foreground">URL:</div>
                      <div className="break-all">{metadata.currentUrl}</div>
                      <div className="font-semibold text-muted-foreground">Resolution:</div>
                      <div>{metadata.screenResolution}</div>
                      <div className="font-semibold text-muted-foreground">Timestamp:</div>
                      <div>{metadata.timestamp}</div>
                      <div className="font-semibold text-muted-foreground">User Agent:</div>
                      <div className="break-all">{metadata.userAgent}</div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Bug Report"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>

        <div>
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Info className="mr-2 h-5 w-5 text-primary" />
                Helpful Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <p>Great bug reports help us fix issues faster. Keep these tips in mind:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Describe what happened:</strong> Be specific about the error or unexpected behavior.</li>
                <li><strong>Explain what you expected:</strong> Tell us how you thought the feature should work.</li>
                <li><strong>Include screenshots:</strong> Visuals are incredibly helpful when possible.</li>
                <li><strong>List steps:</strong> Clear steps to reproduce the issue ensure we can see it on our end.</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
