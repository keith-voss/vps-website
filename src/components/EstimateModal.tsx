import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useEffect, useRef } from "react";

interface EstimateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EstimateModal = ({ open, onOpenChange }: EstimateModalProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && containerRef.current) {
      // Clear existing content
      containerRef.current.innerHTML = '';
      
      // Create the container div
      const formDiv = document.createElement('div');
      formDiv.id = '1674cd73-8232-415c-834e-837c9dc881a9-2123840';
      containerRef.current.appendChild(formDiv);

      // Add the CSS
      const linkEl = document.createElement('link');
      linkEl.rel = 'stylesheet';
      linkEl.href = 'https://d3ey4dbjkt2f6s.cloudfront.net/assets/external/work_request_embed.css';
      linkEl.media = 'screen';
      containerRef.current.appendChild(linkEl);

      // Add the script
      const scriptEl = document.createElement('script');
      scriptEl.src = 'https://d3ey4dbjkt2f6s.cloudfront.net/assets/static_link/work_request_embed_snippet.js';
      scriptEl.setAttribute('clienthub_id', '1674cd73-8232-415c-834e-837c9dc881a9-2123840');
      scriptEl.setAttribute('form_url', 'https://clienthub.getjobber.com/client_hubs/1674cd73-8232-415c-834e-837c9dc881a9/public/work_request/embedded_work_request_form?form_id=2123840');
      containerRef.current.appendChild(scriptEl);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl">Get Your Free Estimate</DialogTitle>
        </DialogHeader>
        <div ref={containerRef} className="min-h-[400px]" />
      </DialogContent>
    </Dialog>
  );
};

export default EstimateModal;
