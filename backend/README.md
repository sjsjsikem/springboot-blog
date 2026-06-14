# Spring Boot 博客系统 - 后端

当前项目的启动方式（进入ide的终端）：

cd springboot-blog\backend

·mvn spring-boot:run

## 📁 项目结构

```
backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── blog/
│   │   │           ├── BlogApplication.java  # 启动类
│   │   │           ├── controller/           # 控制器层
│   │   │           ├── service/              # 服务层
│   │   │           ├── repository/           # 数据访问层
│   │   │           ├── entity/               # 实体类
│   │   │           ├── dto/                  # 数据传输对象
│   │   │           └── config/               # 配置类
│   │   └── resources/
│   │       ├── application.yml              # 配置文件
│   │       └── static/                      # 静态资源
│   └── test/                                # 测试代码
└── pom.xml                                  # Maven 配置
```

## 🚀 快速开始

### 1. 环境要求

- JDK 21+
- Maven 3.9+
- MySQL 8.0+

### 2. 数据库配置

在 `src/main/resources/application.yml` 中配置数据库连接

### 3. 运行项目

```bash
mvn spring-boot:run
```

### 4. 访问接口

- API 文档：<http://localhost:8080/api-docs>
- 首页：<http://localhost:8080>

## 📚 学习路线

- 第 15 天：Spring Boot Hello World
- 第 16 天：Spring Boot 原理
- 第 17 天：RESTful API
- 第 18 天：数据库连接
- 第 19 天：JPA Repository
- 第 20 天：Service 层
- 第 21 天：Controller 层
- 第 22 天：统一响应、异常处理

## 🔧 技术栈

- Spring Boot 3.x
- Spring Data JPA
- MySQL
- Lombok
- Spring Security + JWT

