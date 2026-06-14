/**
 * 用户卡片组件
 * 
 * 演示如何使用 Props 传递数据
 * 
 * Props 说明：
 * - name: 用户姓名
 * - age: 用户年龄
 * - email: 用户邮箱
 * - isActive: 是否活跃用户
 */

/**
 * UserCard 组件函数
 * 
 * 参数解构写法：
 * function UserCard(props) {
 *   const name = props.name
 *   const age = props.age
 *   ...
 * }
 * 
 * 等价于解构写法：
 * function UserCard({ name, age, email, isActive }) {
 *   // 直接使用变量
 * }
 */
function UserCard({ name, age, email, isActive }) {
  return (
    <div className="user-card" style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '16px',
      margin: '10px',
      backgroundColor: isActive ? '#f0fff0' : '#fff5f5'
    }}>
      <h3>{name}</h3>
      <p>年龄：{age}岁</p>
      <p>邮箱：{email}</p>
      <p>状态：{isActive ? '活跃' : '不活跃'}</p>
    </div>
  )
}

export default UserCard