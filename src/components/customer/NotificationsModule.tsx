import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, BellOff, Check, CheckCheck, Calendar, DollarSign, Package, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { format } from 'date-fns';

export const NotificationsModule = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  // Fetch notifications
  const { data: notifications, refetch } = useQuery({
    queryKey: ['notifications', user?.id, filter],
    queryFn: async () => {
      if (!user?.id) return [];
      
      let query = supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (filter === 'unread') {
        query = query.eq('is_read', false);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

  // Real-time subscription for new notifications
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          toast.success('New notification received!');
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, refetch]);

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;
      refetch();
    } catch (error: any) {
      toast.error('Failed to mark as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user?.id)
        .eq('is_read', false);

      if (error) throw error;
      toast.success('All notifications marked as read');
      refetch();
    } catch (error: any) {
      toast.error('Failed to mark all as read');
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'rental_expiry':
        return <Calendar className="h-5 w-5 text-orange-500" />;
      case 'payment_due':
        return <DollarSign className="h-5 w-5 text-red-500" />;
      case 'return_confirmation':
        return <Package className="h-5 w-5 text-green-500" />;
      case 'invoice':
        return <DollarSign className="h-5 w-5 text-blue-500" />;
      case 'penalty':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Bell className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getNotificationTypeBadge = (type: string) => {
    const variants: Record<string, string> = {
      rental_expiry: 'warning',
      payment_due: 'destructive',
      return_confirmation: 'success',
      invoice: 'default',
      penalty: 'destructive',
      general: 'secondary'
    };
    return variants[type] || 'secondary';
  };

  const unreadCount = notifications?.filter(n => !n.is_read).length || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-6 w-6 text-primary" />
          <div>
            <h3 className="text-2xl font-bold">Notifications</h3>
            <p className="text-muted-foreground">Stay updated with your rental activity</p>
          </div>
        </div>
        {unreadCount > 0 && (
          <Button onClick={markAllAsRead} variant="outline">
            <CheckCheck className="mr-2 h-4 w-4" />
            Mark All Read ({unreadCount})
          </Button>
        )}
      </div>

      <div className="flex gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
        >
          All Notifications
        </Button>
        <Button
          variant={filter === 'unread' ? 'default' : 'outline'}
          onClick={() => setFilter('unread')}
        >
          Unread {unreadCount > 0 && `(${unreadCount})`}
        </Button>
      </div>

      <div className="space-y-3">
        {!notifications || notifications.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <BellOff className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">No notifications</p>
              <p className="text-sm text-muted-foreground">
                {filter === 'unread' ? "You're all caught up!" : "You don't have any notifications yet"}
              </p>
            </CardContent>
          </Card>
        ) : (
          notifications.map((notification) => (
            <Card
              key={notification.id}
              className={notification.is_read ? 'opacity-60' : 'border-l-4 border-l-primary'}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h4 className="font-semibold">{notification.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                      </div>
                      <Badge variant={getNotificationTypeBadge(notification.type) as any}>
                        {notification.type.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(notification.created_at), 'MMM dd, yyyy - hh:mm a')}
                      </span>
                      {!notification.is_read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <Check className="mr-1 h-3 w-3" />
                          Mark as Read
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
