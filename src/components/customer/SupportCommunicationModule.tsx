import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageCircle, Send, User, Headphones } from 'lucide-react';
import { toast } from 'sonner';

interface Message {
  id: string;
  sender: 'customer' | 'sales' | 'warehouse';
  message: string;
  timestamp: string;
  read: boolean;
}

interface Chat {
  id: string;
  subject: string;
  department: 'sales' | 'warehouse';
  status: 'open' | 'closed';
  last_message: string;
  last_message_time: string;
  unread_count: number;
  messages: Message[];
}

export const SupportCommunicationModule = () => {
  const { user } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [loading, setLoading] = useState(true);
  const [showNewChatDialog, setShowNewChatDialog] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [newChatSubject, setNewChatSubject] = useState('');
  const [newChatDepartment, setNewChatDepartment] = useState<'sales' | 'warehouse'>('sales');

  useEffect(() => {
    fetchChats();
  }, [user]);

  const fetchChats = async () => {
    if (!user) return;

    try {
      // Mock data for demo
      const mockChats: Chat[] = [
        {
          id: '1',
          subject: 'Equipment delivery delay',
          department: 'warehouse',
          status: 'open',
          last_message: 'We apologize for the delay. Your equipment will be delivered by tomorrow.',
          last_message_time: '2025-10-22T10:30:00Z',
          unread_count: 1,
          messages: [
            {
              id: '1',
              sender: 'customer',
              message: 'My equipment delivery is delayed. Contract RC-2025-056',
              timestamp: '2025-10-20T14:00:00Z',
              read: true,
            },
            {
              id: '2',
              sender: 'warehouse',
              message: 'We apologize for the delay. Your equipment will be delivered by tomorrow.',
              timestamp: '2025-10-22T10:30:00Z',
              read: false,
            },
          ],
        },
        {
          id: '2',
          subject: 'Invoice clarification',
          department: 'sales',
          status: 'closed',
          last_message: 'Thank you for your understanding. The invoice has been corrected.',
          last_message_time: '2025-10-18T16:45:00Z',
          unread_count: 0,
          messages: [
            {
              id: '3',
              sender: 'customer',
              message: 'I have a question about invoice INV-2025-156 charges.',
              timestamp: '2025-10-15T09:15:00Z',
              read: true,
            },
            {
              id: '4',
              sender: 'sales',
              message: 'Thank you for your understanding. The invoice has been corrected.',
              timestamp: '2025-10-18T16:45:00Z',
              read: true,
            },
          ],
        },
      ];

      setChats(mockChats);
    } catch (error) {
      console.error('Error fetching chats:', error);
      setChats([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!selectedChat || !newMessage.trim()) return;

    try {
      const message: Message = {
        id: Date.now().toString(),
        sender: 'customer',
        message: newMessage,
        timestamp: new Date().toISOString(),
        read: true,
      };

      // Update chat with new message
      const updatedChat = {
        ...selectedChat,
        messages: [...selectedChat.messages, message],
        last_message: newMessage,
        last_message_time: new Date().toISOString(),
      };

      setChats(prev => prev.map(chat =>
        chat.id === selectedChat.id ? updatedChat : chat
      ));
      setSelectedChat(updatedChat);
      setNewMessage('');
      toast.success('Message sent successfully');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  const handleStartNewChat = async () => {
    if (!newChatSubject.trim()) {
      toast.error('Please enter a subject');
      return;
    }

    try {
      const newChat: Chat = {
        id: Date.now().toString(),
        subject: newChatSubject,
        department: newChatDepartment,
        status: 'open',
        last_message: 'Chat started',
        last_message_time: new Date().toISOString(),
        unread_count: 0,
        messages: [
          {
            id: Date.now().toString(),
            sender: 'customer',
            message: 'Chat started',
            timestamp: new Date().toISOString(),
            read: true,
          },
        ],
      };

      setChats(prev => [newChat, ...prev]);
      setShowNewChatDialog(false);
      setNewChatSubject('');
      setSelectedChat(newChat);
      toast.success('New chat started');
    } catch (error) {
      console.error('Error starting chat:', error);
      toast.error('Failed to start chat');
    }
  };

  const getSenderIcon = (sender: string) => {
    switch (sender) {
      case 'customer':
        return <User className="h-4 w-4" />;
      case 'sales':
        return <Headphones className="h-4 w-4" />;
      case 'warehouse':
        return <MessageCircle className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    return (
      <Badge variant={status === 'open' ? 'default' : 'secondary'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Support & Communication</CardTitle>
          <CardDescription>Loading your support chats...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Support & Communication</CardTitle>
            <CardDescription>Chat with sales or warehouse teams</CardDescription>
          </div>
          <Button onClick={() => setShowNewChatDialog(true)}>
            <MessageCircle className="h-4 w-4 mr-2" />
            Start New Chat
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chat List */}
            <div className="lg:col-span-1">
              <div className="space-y-2">
                {chats.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No chats found</p>
                    <p className="text-sm text-muted-foreground mt-2">Start your first chat using the button above</p>
                  </div>
                ) : (
                  chats.map((chat) => (
                    <div
                      key={chat.id}
                      className={`p-3 border rounded-lg cursor-pointer hover:bg-secondary transition-colors ${
                        selectedChat?.id === chat.id ? 'bg-secondary' : ''
                      }`}
                      onClick={() => setSelectedChat(chat)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-sm truncate">{chat.subject}</h4>
                        {getStatusBadge(chat.status)}
                      </div>
                      <p className="text-xs text-muted-foreground truncate mb-1">{chat.last_message}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {new Date(chat.last_message_time).toLocaleDateString()}
                        </span>
                        {chat.unread_count > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {chat.unread_count}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Chat Messages */}
            <div className="lg:col-span-2">
              {selectedChat ? (
                <div className="h-96 flex flex-col">
                  <div className="flex items-center justify-between p-3 border-b">
                    <div>
                      <h3 className="font-medium">{selectedChat.subject}</h3>
                      <p className="text-sm text-muted-foreground capitalize">{selectedChat.department} Department</p>
                    </div>
                    {getStatusBadge(selectedChat.status)}
                  </div>

                  <ScrollArea className="flex-1 p-3">
                    <div className="space-y-4">
                      {selectedChat.messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex gap-3 ${message.sender === 'customer' ? 'justify-end' : 'justify-start'}`}
                        >
                          {message.sender !== 'customer' && (
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>
                                {getSenderIcon(message.sender)}
                              </AvatarFallback>
                            </Avatar>
                          )}
                          <div
                            className={`max-w-xs px-3 py-2 rounded-lg ${
                              message.sender === 'customer'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-secondary'
                            }`}
                          >
                            <p className="text-sm">{message.message}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {new Date(message.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                          {message.sender === 'customer' && (
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>
                                <User className="h-4 w-4" />
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  {selectedChat.status === 'open' && (
                    <div className="p-3 border-t">
                      <div className="flex gap-2">
                        <Textarea
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Type your message..."
                          className="min-h-[60px] resize-none"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage();
                            }
                          }}
                        />
                        <Button
                          onClick={handleSendMessage}
                          disabled={!newMessage.trim()}
                          className="self-end"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-96 flex items-center justify-center text-center">
                  <div>
                    <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Select a chat to view messages</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* New Chat Dialog */}
      {showNewChatDialog && (
        <Card className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <CardContent className="w-full max-w-md p-6">
            <CardHeader>
              <CardTitle>Start New Chat</CardTitle>
              <CardDescription>Choose a department and describe your issue</CardDescription>
            </CardHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="department">Department</Label>
                <Select value={newChatDepartment} onValueChange={(value: 'sales' | 'warehouse') => setNewChatDepartment(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="warehouse">Warehouse</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={newChatSubject}
                  onChange={(e) => setNewChatSubject(e.target.value)}
                  placeholder="Brief description of your issue"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowNewChatDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleStartNewChat}>
                  Start Chat
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};