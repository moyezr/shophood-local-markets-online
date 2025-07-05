import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AdSlot } from '../types';

interface AdCreationDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (adData: Partial<AdSlot>) => void;
  initialData?: AdSlot;
}

export function AdCreationDialog({ open, onClose, onSubmit, initialData }: AdCreationDialogProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    type: (initialData?.type || 'sponsored') as 'sponsored' | 'banner',
    bidAmount: initialData?.bidAmount || 25
  });

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
    // Reset form
    setFormData({
      title: '',
      description: '',
      type: 'sponsored',
      bidAmount: 25
    });
  };

  const handleClose = () => {
    onClose();
    // Reset form if not editing
    if (!initialData) {
      setFormData({
        title: '',
        description: '',  
        type: 'sponsored',
        bidAmount: 25
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Advertisement' : 'Create New Advertisement'}</DialogTitle>
          <DialogDescription>
            {initialData 
              ? 'Update your advertisement details below.'
              : 'Create a new advertisement to promote your business and attract more customers.'
            }
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="ad-title">Advertisement Title</Label>
            <Input
              id="ad-title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter advertisement title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ad-description">Description</Label>
            <Textarea
              id="ad-description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your advertisement..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ad-type">Advertisement Type</Label>
            <Select 
              value={formData.type} 
              onValueChange={(value: 'sponsored' | 'banner') => setFormData(prev => ({ ...prev, type: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sponsored">Sponsored Listing</SelectItem>
                <SelectItem value="banner">Banner Advertisement</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bid-amount">Daily Bid Amount ($)</Label>
            <Input
              id="bid-amount"
              type="number"
              min="1"
              step="1"
              value={formData.bidAmount}
              onChange={(e) => setFormData(prev => ({ ...prev, bidAmount: parseInt(e.target.value) || 1 }))}
              placeholder="25"
            />
            <p className="text-xs text-gray-500">
              Higher bid amounts increase visibility in search results
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!formData.title.trim() || !formData.description.trim()}
            className="bg-gradient-to-r from-shophood-500 to-shophood-600 hover:from-shophood-600 hover:to-shophood-700"
          >
            {initialData ? 'Update Advertisement' : 'Create Advertisement'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}