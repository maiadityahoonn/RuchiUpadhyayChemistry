import { useState } from 'react';
import { X, Maximize2, Minimize2, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface VideoPlayerProps {
  videoId: string;
  title: string;
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

const VideoPlayer = ({ videoId, title, isOpen, onClose, onComplete }: VideoPlayerProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleVideoEnd = () => {
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${isFullscreen ? 'max-w-[95vw] h-[90vh]' : 'max-w-4xl'} p-0 overflow-hidden bg-black`}>
        <DialogHeader className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/80 to-transparent">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-white text-lg font-semibold pr-8">
              {title}
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="text-white hover:bg-white/20"
              >
                {isFullscreen ? (
                  <Minimize2 className="w-5 h-5" />
                ) : (
                  <Maximize2 className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className={`w-full ${isFullscreen ? 'h-full' : 'aspect-video'}`}>
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
            title={title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>

        {onComplete && (
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
            <Button
              onClick={() => {
                onComplete();
                onClose();
              }}
              className="w-full bg-success hover:bg-success/90"
            >
              Mark as Complete & Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default VideoPlayer;
