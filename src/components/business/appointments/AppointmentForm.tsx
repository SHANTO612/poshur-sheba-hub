import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Calendar } from '../../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../../../lib/utils';
import { toast } from '../../ui/sonner';
import { useAuth } from '../../../contexts/AuthContext';
import apiService from '../../../services/api';

interface AppointmentFormProps {
  veterinarian: {
    _id: string;
    name: string;
    phone: string;
    clinicName?: string;
    specialization?: string;
  };
  onAppointmentBooked: () => void;
  trigger?: React.ReactNode;
}

interface AppointmentData {
  patientName: string;
  patientPhone: string;
  animalType: string;
  animalAge: string;
  problem: string;
  preferredDate: Date | undefined;
  preferredTime: string;
  urgency: string;
  additionalNotes: string;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({ 
  veterinarian, 
  onAppointmentBooked,
  trigger 
}) => {
  const { user, token } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<AppointmentData>({
    patientName: '',
    patientPhone: '',
    animalType: '',
    animalAge: '',
    problem: '',
    preferredDate: undefined,
    preferredTime: '',
    urgency: 'normal',
    additionalNotes: ''
  });

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
    '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM'
  ];

  const animalTypes = [
    'Cattle', 'Buffalo', 'Goat', 'Sheep', 'Pig', 'Poultry', 'Horse', 'Other'
  ];

  const urgencyLevels = [
    { value: 'emergency', label: 'Emergency (Immediate)', color: 'text-red-600' },
    { value: 'urgent', label: 'Urgent (Same Day)', color: 'text-orange-600' },
    { value: 'normal', label: 'Normal (Scheduled)', color: 'text-green-600' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.preferredDate) {
      toast.error('Please select a preferred date');
      return;
    }

    if (!formData.preferredTime) {
      toast.error('Please select a preferred time');
      return;
    }

    try {
      setLoading(true);
      
      const appointmentData = {
        veterinarianId: veterinarian._id,
        veterinarianName: veterinarian.name,
        patientName: formData.patientName,
        patientPhone: formData.patientPhone,
        animalType: formData.animalType,
        animalAge: formData.animalAge,
        problem: formData.problem,
        preferredDate: formData.preferredDate.toISOString(),
        preferredTime: formData.preferredTime,
        urgency: formData.urgency,
        additionalNotes: formData.additionalNotes,
        status: 'pending',
        bookedBy: user?._id,
        bookedByName: user?.name
      };

      const response = await apiService.post('/appointments/book', appointmentData, token);
      
      if (response.success) {
        toast.success('Appointment booked successfully!');
        setOpen(false);
        onAppointmentBooked();
        
        // Reset form
        setFormData({
          patientName: '',
          patientPhone: '',
          animalType: '',
          animalAge: '',
          problem: '',
          preferredDate: undefined,
          preferredTime: '',
          urgency: 'normal',
          additionalNotes: ''
        });
      } else {
        toast.error(response.message || 'Failed to book appointment');
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast.error('Failed to book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof AppointmentData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            <CalendarIcon className="mr-2 h-4 w-4" />
            Book Appointment
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Book Appointment with Dr. {veterinarian.name}
          </DialogTitle>
          {veterinarian.clinicName && (
            <p className="text-gray-600">{veterinarian.clinicName}</p>
          )}
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Patient Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="patientName">Patient Name *</Label>
                <Input
                  id="patientName"
                  value={formData.patientName}
                  onChange={(e) => handleInputChange('patientName', e.target.value)}
                  placeholder="Your name"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="patientPhone">Phone Number *</Label>
                <Input
                  id="patientPhone"
                  value={formData.patientPhone}
                  onChange={(e) => handleInputChange('patientPhone', e.target.value)}
                  placeholder="Your phone number"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="animalType">Animal Type *</Label>
                <Select
                  value={formData.animalType}
                  onValueChange={(value) => handleInputChange('animalType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select animal type" />
                  </SelectTrigger>
                  <SelectContent>
                    {animalTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="animalAge">Animal Age</Label>
                <Input
                  id="animalAge"
                  value={formData.animalAge}
                  onChange={(e) => handleInputChange('animalAge', e.target.value)}
                  placeholder="e.g., 2 years"
                />
              </div>
            </div>
          </div>

          {/* Problem Description */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Problem Description</h3>
            
            <div>
              <Label htmlFor="problem">Describe the Problem *</Label>
              <Textarea
                id="problem"
                value={formData.problem}
                onChange={(e) => handleInputChange('problem', e.target.value)}
                placeholder="Please describe the symptoms, behavior changes, or health concerns..."
                rows={4}
                required
              />
            </div>

            <div>
              <Label htmlFor="urgency">Urgency Level *</Label>
              <Select
                value={formData.urgency}
                onValueChange={(value) => handleInputChange('urgency', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select urgency level" />
                </SelectTrigger>
                <SelectContent>
                  {urgencyLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      <span className={level.color}>{level.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Appointment Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Appointment Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Preferred Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.preferredDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.preferredDate ? (
                        format(formData.preferredDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.preferredDate}
                      onSelect={(date) => handleInputChange('preferredDate', date)}
                      initialFocus
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div>
                <Label htmlFor="preferredTime">Preferred Time *</Label>
                <Select
                  value={formData.preferredTime}
                  onValueChange={(value) => handleInputChange('preferredTime', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="additionalNotes">Additional Notes</Label>
              <Textarea
                id="additionalNotes"
                value={formData.additionalNotes}
                onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                placeholder="Any additional information or special requirements..."
                rows={3}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Booking...' : 'Book Appointment'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentForm; 