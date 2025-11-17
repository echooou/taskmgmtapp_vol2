import { useState } from 'react';
import { useTaskStore } from '../store/taskStore';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, parseISO, startOfWeek, endOfWeek } from 'date-fns';
import { ja } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Task } from '../types/task';

export default function Calendar() {
  const { tasks } = useTaskStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getTasksForDate = (date: Date): Task[] => {
    return tasks.filter((task) => {
      const startDate = parseISO(task.startDate);
      const dueDate = parseISO(task.dueDate);
      return date >= startDate && date <= dueDate;
    }).sort((a, b) => a.priority - b.priority);
  };

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const selectedDateTasks = selectedDate ? getTasksForDate(selectedDate) : [];

  const getStatusColor = (status: string) => {
    const colors = {
      '未着手': 'bg-blue-400',
      '進行中': 'bg-purple-400',
      '完了': 'bg-green-400',
      '保留': 'bg-pink-400',
    };
    return colors[status as keyof typeof colors] || 'bg-blue-400';
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        <h2 className="text-xl md:text-2xl font-bold">カレンダー</h2>
        <div className="flex items-center gap-2 md:gap-4">
          <Button variant="outline" size="icon" onClick={handlePreviousMonth} className="h-8 w-8 md:h-10 md:w-10">
            <ChevronLeft className="h-3 w-3 md:h-4 md:w-4" />
          </Button>
          <span className="text-base md:text-lg font-medium min-w-[140px] md:min-w-[200px] text-center">
            {format(currentDate, 'yyyy年 M月', { locale: ja })}
          </span>
          <Button variant="outline" size="icon" onClick={handleNextMonth} className="h-8 w-8 md:h-10 md:w-10">
            <ChevronRight className="h-3 w-3 md:h-4 md:w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 md:gap-2">
        {['日', '月', '火', '水', '木', '金', '土'].map((day, index) => (
          <div
            key={day}
            className={`text-center font-medium py-1 md:py-2 text-xs md:text-sm ${
              index === 0 ? 'text-red-600' : index === 6 ? 'text-blue-600' : ''
            }`}
          >
            {day}
          </div>
        ))}

        {calendarDays.map((day, index) => {
          const dayTasks = getTasksForDate(day);
          const isCurrentMonth = day.getMonth() === currentDate.getMonth();
          const isToday = isSameDay(day, new Date());
          const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;

          return (
            <div
              key={index}
              onClick={() => handleDateClick(day)}
              className={`min-h-[60px] md:min-h-[100px] p-1 md:p-2 border border-blue-100 rounded-md md:rounded-lg cursor-pointer transition-all hover:shadow-md ${
                !isCurrentMonth ? 'bg-blue-50/30 text-gray-400' : 'bg-white/80 backdrop-blur-sm'
              } ${isToday ? 'ring-1 md:ring-2 ring-purple-300 shadow-md' : ''} ${
                isSelected ? 'bg-gradient-to-br from-blue-50 to-purple-50' : ''
              }`}
            >
              <div className={`text-xs md:text-sm font-medium mb-0.5 md:mb-1 ${
                index % 7 === 0 ? 'text-red-600' : index % 7 === 6 ? 'text-blue-600' : ''
              }`}>
                {format(day, 'd')}
              </div>
              <div className="space-y-0.5 md:space-y-1">
                {/* Mobile: Show dots for tasks */}
                <div className="md:hidden flex gap-0.5 flex-wrap">
                  {dayTasks.slice(0, 4).map((task) => (
                    <span
                      key={task.id}
                      className={`w-1.5 h-1.5 rounded-full ${getStatusColor(task.status)}`}
                      title={task.name}
                    />
                  ))}
                  {dayTasks.length > 4 && (
                    <span className="text-[8px] text-gray-500">+{dayTasks.length - 4}</span>
                  )}
                </div>
                {/* Desktop: Show task names */}
                <div className="hidden md:block space-y-1">
                  {dayTasks.slice(0, 3).map((task) => (
                    <div
                      key={task.id}
                      className="text-xs px-1 py-0.5 rounded truncate bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100"
                      title={task.name}
                    >
                      <span className={`inline-block w-2 h-2 rounded-full mr-1 ${getStatusColor(task.status)}`}></span>
                      {task.name}
                    </div>
                  ))}
                  {dayTasks.length > 3 && (
                    <div className="text-xs text-gray-500 px-1">
                      +{dayTasks.length - 3}件
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedDate && (
        <Card className="border-0 md:border shadow-none md:shadow-sm">
          <CardHeader>
            <CardTitle className="text-base md:text-lg">
              {format(selectedDate, 'yyyy年M月d日(E)', { locale: ja })} のタスク
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDateTasks.length === 0 ? (
              <p className="text-gray-500 text-center py-4 text-sm">この日のタスクはありません</p>
            ) : (
              <div className="space-y-3">
                {selectedDateTasks.map((task, index) => (
                  <div key={task.id} className="border border-blue-100 rounded-lg p-3 md:p-4 bg-white/80 backdrop-blur-sm">
                    <div className="flex items-start gap-2 md:gap-3">
                      <div className="text-base md:text-lg font-bold text-gray-400">#{index + 1}</div>
                      <div className="flex-1">
                        <h4 className="font-medium text-base md:text-lg mb-2">{task.name}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-gray-500">顧客:</span> {task.customer}
                          </div>
                          <div>
                            <span className="text-gray-500">カテゴリ:</span> {task.category}
                          </div>
                          <div>
                            <span className="text-gray-500">ステータス:</span>{' '}
                            <span className={`px-2 py-0.5 rounded-full text-xs ${
                              task.status === '未着手' ? 'bg-blue-100 text-blue-700' :
                              task.status === '進行中' ? 'bg-purple-100 text-purple-700' :
                              task.status === '完了' ? 'bg-green-100 text-green-700' :
                              'bg-pink-100 text-pink-700'
                            }`}>
                              {task.status}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">工数:</span> {task.workload}時間
                          </div>
                        </div>
                        {task.memo && (
                          <div className="mt-2 text-sm text-gray-600">
                            <span className="text-gray-500">メモ:</span> {task.memo}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
