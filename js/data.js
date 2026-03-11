// BAS-SAAS - Generador de Datos Demo
class DataGenerator {
  constructor() {
    this.initData();
  }

  initData() {
    if (!localStorage.getItem('bas_analytics')) {
      this.generateAnalytics();
    }
    if (!localStorage.getItem('bas_subscriptions')) {
      this.generateSubscriptions();
    }
    if (!localStorage.getItem('bas_activity')) {
      this.generateActivity();
    }
  }

  generateAnalytics() {
    const data = {
      overview: {
        totalRevenue: 45780,
        activeUsers: 1247,
        churnRate: 2.8,
        mrr: 15260,
        growth: 18.5
      },
      revenue: this.generateRevenueData(),
      users: this.generateUserGrowth(),
      churn: this.generateChurnData()
    };
    localStorage.setItem('bas_analytics', JSON.stringify(data));
  }

  generateRevenueData() {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map((month, i) => ({
      month,
      revenue: Math.floor(2500 + Math.random() * 2000 + (i * 150)),
      mrr: Math.floor(1000 + Math.random() * 800 + (i * 80))
    }));
  }

  generateUserGrowth() {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let total = 850;
    return months.map(month => {
      total += Math.floor(20 + Math.random() * 40);
      return { month, users: total };
    });
  }

  generateChurnData() {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map(month => ({
      month,
      rate: parseFloat((2 + Math.random() * 2).toFixed(1))
    }));
  }

  generateSubscriptions() {
    const plans = [
      { name: 'Free', price: 0, users: 523, color: '#64748b' },
      { name: 'Starter', price: 29, users: 412, color: '#3b82f6' },
      { name: 'Pro', price: 79, users: 234, color: '#8b5cf6' },
      { name: 'Enterprise', price: 199, users: 78, color: '#ec4899' }
    ];
    localStorage.setItem('bas_subscriptions', JSON.stringify(plans));
  }

  generateActivity() {
    const activities = [
      { type: 'signup', user: 'john@example.com', time: '2 minutes ago', icon: '👤' },
      { type: 'upgrade', user: 'sarah@company.com', plan: 'Pro', time: '15 minutes ago', icon: '⬆️' },
      { type: 'payment', user: 'mike@startup.io', amount: '$79', time: '1 hour ago', icon: '💳' },
      { type: 'cancel', user: 'jane@test.com', time: '3 hours ago', icon: '❌' },
      { type: 'signup', user: 'alex@demo.com', time: '5 hours ago', icon: '👤' }
    ];
    localStorage.setItem('bas_activity', JSON.stringify(activities));
  }

  getAnalytics() {
    return JSON.parse(localStorage.getItem('bas_analytics'));
  }

  getSubscriptions() {
    return JSON.parse(localStorage.getItem('bas_subscriptions'));
  }

  getActivity() {
    return JSON.parse(localStorage.getItem('bas_activity'));
  }
}

const dataGen = new DataGenerator();
