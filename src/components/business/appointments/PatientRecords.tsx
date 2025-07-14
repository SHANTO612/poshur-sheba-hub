import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { 
  User, 
  Calendar, 
  Clock, 
  Phone, 
  AlertCircle,
  CheckCircle,
  XCircle,
  Calendar as CalendarIcon
} from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../../../contexts/AuthContext';
import apiService from '../../../services/api';
import { toast } from '../../ui/sonner';

interface Appointment {
  _id: string;
  patientName: string;
  patientPhone: string;
  animalType: string;
  animalAge: string;
  problem: string;
  preferredDate: string;
  preferredTime: string;
  urgency: string;
  status: string;
  additionalNotes: string;
  notes: string;
  createdAt: string;
  confirmedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
}

interface PatientRecordsProps {
  trigger?: React.ReactNode;
}

const PatientRecords: React.FC<PatientRecordsProps> = ({ trigger }) => {
  const { token } = useAuth();
  const [open, setOpen] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  useEffect(() => {
    if (open) {
      fetchAppointments();
    }
  }, [open, selectedStatus]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await apiService.get(`/appointments/veterinarian?status=${selectedStatus}`, token);
      
      if (response.success) {
        setAppointments((response.data as Appointment[]) || []);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Failed to load patient records');
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (appointmentId: string, status: string, notes?: string) => {
    try {
      const response = await apiService.put(`/appointments/${appointmentId}/status`, {
        status,
        notes
      }, token);
      
      if (response.success) {
        toast.success('Appointment status updated successfully');
        fetchAppointments();
      } else {
        toast.error(response.message || 'Failed to update appointment status');
      }
    } catch (error) {
      console.error('Error updating appointment status:', error);
      toast.error('Failed to update appointment status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'emergency': return 'text-red-600';
      case 'urgent': return 'text-orange-600';
      case 'normal': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <CalendarIcon className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="h-20 bg-green-600 hover:bg-green-700 text-white">
            <div className="text-center">
              <User className="h-6 w-6 mx-auto mb-2" />
              <p className="text-sm font-medium">Patient Records</p>
              <p className="text-xs opacity-90">View History</p>
            </div>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Patient Records & Appointments
          </DialogTitle>
        </DialogHeader>

        {/* Filter */}
        <div className="flex gap-2 mb-4">
          <Button
            variant={selectedStatus === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedStatus('all')}
          >
            All
          </Button>
          <Button
            variant={selectedStatus === 'pending' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedStatus('pending')}
          >
            Pending
          </Button>
          <Button
            variant={selectedStatus === 'confirmed' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedStatus('confirmed')}
          >
            Confirmed
          </Button>
          <Button
            variant={selectedStatus === 'completed' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedStatus('completed')}
          >
            Completed
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading patient records...</p>
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-8">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
            <p className="text-gray-600">
              {selectedStatus === 'all' 
                ? 'No appointments have been booked yet.'
                : `No ${selectedStatus} appointments found.`
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <Card key={appointment._id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-blue-600" />
                      <div>
                        <h3 className="font-semibold">{appointment.patientName}</h3>
                        <p className="text-sm text-gray-600">{appointment.animalType}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(appointment.status)}>
                        {getStatusIcon(appointment.status)}
                        <span className="ml-1 capitalize">{appointment.status}</span>
                      </Badge>
                      <span className={`text-sm font-medium ${getUrgencyColor(appointment.urgency)}`}>
                        {appointment.urgency}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Contact Information</p>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {appointment.patientPhone}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Appointment Details</p>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(appointment.preferredDate), 'PPP')} at {appointment.preferredTime}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700">Problem Description</p>
                    <p className="text-sm text-gray-600">{appointment.problem}</p>
                  </div>

                  {appointment.additionalNotes && (
                    <div>
                      <p className="text-sm font-medium text-gray-700">Additional Notes</p>
                      <p className="text-sm text-gray-600">{appointment.additionalNotes}</p>
                    </div>
                  )}

                  {appointment.notes && (
                    <div>
                      <p className="text-sm font-medium text-gray-700">Veterinarian Notes</p>
                      <p className="text-sm text-gray-600">{appointment.notes}</p>
                    </div>
                  )}

                  {appointment.cancellationReason && (
                    <div>
                      <p className="text-sm font-medium text-gray-700">Cancellation Reason</p>
                      <p className="text-sm text-gray-600">{appointment.cancellationReason}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  {appointment.status === 'pending' && (
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        onClick={() => updateAppointmentStatus(appointment._id, 'confirmed')}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Confirm
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateAppointmentStatus(appointment._id, 'cancelled')}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}

                  {appointment.status === 'confirmed' && (
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        onClick={() => updateAppointmentStatus(appointment._id, 'completed')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Mark Complete
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PatientRecords; 