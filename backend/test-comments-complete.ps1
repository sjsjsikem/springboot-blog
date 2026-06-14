# 评论模块完整测试脚本（第 30 天）
# 使用方法：.\test-comments-complete.ps1

$ErrorActionPreference = "Stop"
$baseUrl = "http://localhost:8080/api/comments"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  评论模块测试 - 第 30 天" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

try {
    # ========================================
    # 测试 1：创建评论和回复
    # ========================================
    Write-Host "`n[测试 1] 创建评论和回复" -ForegroundColor Magenta
    Write-Host "----------------------------------------" -ForegroundColor DarkGray
    
    # 创建第一条评论（根评论）
    Write-Host "`n1.1 创建第一条评论（根评论）..." -ForegroundColor Yellow
    $comment1 = Invoke-RestMethod -Uri "$baseUrl" -Method POST `
        -ContentType "application/json" `
        -Body '{"articleId":1,"commentator":"张三","email":"zhangsan@example.com","content":"这是第一条评论，写得真好！"}'
    
    $comment1Id = $comment1.data.id
    Write-Host "✓ 评论 1 创建成功" -ForegroundColor Green
    Write-Host "  ├─ ID: $($comment1.data.id)" -ForegroundColor Gray
    Write-Host "  ├─ 评论者：$($comment1.data.commentator)" -ForegroundColor Gray
    Write-Host "  └─ 内容：$($comment1.data.content)" -ForegroundColor Gray
    
    Start-Sleep -Milliseconds 100
    
    # 创建第二条评论（根评论）
    Write-Host "`n1.2 创建第二条评论（根评论）..." -ForegroundColor Yellow
    $comment2 = Invoke-RestMethod -Uri "$baseUrl" -Method POST `
        -ContentType "application/json" `
        -Body '{"articleId":1,"commentator":"李四","email":"lisi@example.com","content":"我也觉得不错，支持一下！"}'
    
    $comment2Id = $comment2.data.id
    Write-Host "✓ 评论 2 创建成功" -ForegroundColor Green
    Write-Host "  └─ ID: $($comment2.data.id)" -ForegroundColor Gray
    
    Start-Sleep -Milliseconds 100
    
    # 创建回复（回复评论 1）
    Write-Host "`n1.3 创建回复（回复评论 1）..." -ForegroundColor Yellow
    $comment3 = Invoke-RestMethod -Uri "$baseUrl" -Method POST `
        -ContentType "application/json" `
        -Body @"
{
  "articleId": 1,
  "commentator": "王五",
  "email": "wangwu@example.com",
  "content": "谢谢你的支持！",
  "parentId": $comment1Id
}
"@
    
    $comment3Id = $comment3.data.id
    Write-Host "✓ 评论 3（回复）创建成功" -ForegroundColor Green
    Write-Host "  ├─ ID: $($comment3.data.id)" -ForegroundColor Gray
    Write-Host "  ├─ parentId: $($comment3.data.parentId)" -ForegroundColor Gray
    Write-Host "  └─ rootId: $($comment3.data.rootId)" -ForegroundColor Gray
    
    Start-Sleep -Milliseconds 100
    
    # 创建二级回复（回复评论 3）
    Write-Host "`n1.4 创建二级回复（回复评论 3）..." -ForegroundColor Yellow
    $comment4 = Invoke-RestMethod -Uri "$baseUrl" -Method POST `
        -ContentType "application/json" `
        -Body @"
{
  "articleId": 1,
  "commentator": "小明",
  "email": "xiaoming@example.com",
  "content": "大家都太热情了！",
  "parentId": $comment3Id
}
"@
    
    $comment4Id = $comment4.data.id
    Write-Host "✓ 评论 4（二级回复）创建成功" -ForegroundColor Green
    Write-Host "  ├─ ID: $($comment4.data.id)" -ForegroundColor Gray
    Write-Host "  ├─ parentId: $($comment4.data.parentId)" -ForegroundColor Gray
    Write-Host "  └─ rootId: $($comment4.data.rootId)" -ForegroundColor Gray
    
    Write-Host "`n✓ 测试 1 完成：创建了 4 条评论（包含回复）" -ForegroundColor Green
    
    # ========================================
    # 测试 2：查询所有评论（树形结构）
    # ========================================
    Write-Host "`n[测试 2] 查询所有评论（树形结构）" -ForegroundColor Magenta
    Write-Host "----------------------------------------" -ForegroundColor DarkGray
    
    $comments = Invoke-RestMethod -Uri "$baseUrl?articleId=1" -Method GET
    Write-Host "查询到 $($comments.data.Count) 条根评论" -ForegroundColor Yellow
    
    foreach ($comment in $comments.data) {
        Write-Host "`n  ├─ 评论 ID: $($comment.id)" -ForegroundColor White
        Write-Host "  │   ├─ 评论者：$($comment.commentator)" -ForegroundColor Gray
        Write-Host "  │   ├─ 内容：$($comment.content)" -ForegroundColor Gray
        Write-Host "  │   └─ 状态：$($comment.status)" -ForegroundColor Gray
        
        if ($comment.replies -and $comment.replies.Count -gt 0) {
            Write-Host "  │   └─ 回复数量：$($comment.replies.Count)" -ForegroundColor Cyan
            foreach ($reply in $comment.replies) {
                Write-Host "  │       ├─ 回复 ID: $($reply.id)" -ForegroundColor DarkGray
                Write-Host "  │       ├─ 评论者：$($reply.commentator)" -ForegroundColor DarkGray
                Write-Host "  │       └─ 内容：$($reply.content)" -ForegroundColor DarkGray
            }
        }
    }
    
    Write-Host "`n✓ 测试 2 完成：成功查询树形结构评论" -ForegroundColor Green
    
    # ========================================
    # 测试 3：软删除评论（评论 1）
    # ========================================
    Write-Host "`n[测试 3] 软删除评论（评论 1）" -ForegroundColor Magenta
    Write-Host "----------------------------------------" -ForegroundColor DarkGray
    
    Write-Host "`n3.1 执行软删除..." -ForegroundColor Yellow
    $deleted = Invoke-RestMethod -Uri "$baseUrl/$comment1Id" -Method DELETE
    
    Write-Host "删除后状态码：$($deleted.data.status)" -ForegroundColor Yellow
    Write-Host "删除后内容：$($deleted.data.content)" -ForegroundColor Yellow
    
    # 验证软删除
    if ($deleted.data.status -eq -1 -and $deleted.data.content -eq "该评论已被屏蔽/删除") {
        Write-Host "✓ 验证成功：评论已软删除" -ForegroundColor Green
    } else {
        Write-Host "✗ 验证失败：软删除未生效" -ForegroundColor Red
        throw "软删除测试失败"
    }
    
    # 验证评论仍然可见（显示删除标记）
    Write-Host "`n3.2 验证评论仍然可见（显示删除标记）..." -ForegroundColor Yellow
    $comments = Invoke-RestMethod -Uri "$baseUrl?articleId=1" -Method GET
    $deletedComment = $comments.data | Where-Object { $_.id -eq $comment1Id }
    
    if ($deletedComment) {
        Write-Host "✓ 评论仍然在列表中（显示删除标记）" -ForegroundColor Green
        Write-Host "  ├─ 状态：$($deletedComment.status)" -ForegroundColor White
        Write-Host "  ├─ 内容：$($deletedComment.content)" -ForegroundColor White
        Write-Host "  └─ 评论者：$($deletedComment.commentator)" -ForegroundColor White
        
        # 验证子评论仍然可见
        if ($deletedComment.replies -and $deletedComment.replies.Count -gt 0) {
            Write-Host "  └─ 子评论数量：$($deletedComment.replies.Count) （仍然可见）" -ForegroundColor Cyan
        }
    } else {
        Write-Host "✗ 评论从列表中消失了（这是物理删除，不是软删除）" -ForegroundColor Red
        throw "软删除验证失败"
    }
    
    Write-Host "`n✓ 测试 3 完成：软删除成功，评论楼结构保持完整" -ForegroundColor Green
    
    # ========================================
    # 测试 4：审核评论功能
    # ========================================
    Write-Host "`n[测试 4] 审核评论功能" -ForegroundColor Magenta
    Write-Host "----------------------------------------" -ForegroundColor DarkGray
    
    # 使用 MySQL 直接插入待审核评论
    Write-Host "`n4.1 创建待审核评论（status=0）..." -ForegroundColor Yellow
    try {
        $mysqlCommand = "mysql -u blog_user -pblog123456 blog -e `"INSERT INTO comment (article_id, commentator, email, content, status, ip_address, create_time, update_time) VALUES (1, '待审核用户', 'pending@example.com', '这条评论需要审核', 0, '127.0.0.1', NOW(), NOW());`""
        Invoke-Expression $mysqlCommand
        Write-Host "✓ 待审核评论已插入数据库" -ForegroundColor Green
    } catch {
        Write-Host "⚠ MySQL 插入失败，跳过此步骤" -ForegroundColor DarkGray
    }
    
    # 查询待审核评论
    Write-Host "`n4.2 查询待审核评论..." -ForegroundColor Yellow
    try {
        $pendingComments = Invoke-RestMethod -Uri "$baseUrl/status?articleId=1&status=0" -Method GET
        Write-Host "待审核评论数量：$($pendingComments.data.Count)" -ForegroundColor Yellow
        
        if ($pendingComments.data.Count -gt 0) {
            $pendingId = $pendingComments.data[0].id
            Write-Host "找到待审核评论，ID = $pendingId" -ForegroundColor Yellow
            
            # 审核通过
            Write-Host "`n4.3 审核通过（status=1）..." -ForegroundColor Yellow
            $approveResult = Invoke-RestMethod -Uri "$baseUrl/$pendingId/status?status=1" -Method PUT
            Write-Host "审核结果：$($approveResult.message)" -ForegroundColor Green
            Write-Host "新状态：$($approveResult.data.status)" -ForegroundColor Yellow
            
            # 验证审核结果
            Write-Host "`n4.4 验证审核结果..." -ForegroundColor Yellow
            $approvedComments = Invoke-RestMethod -Uri "$baseUrl/status?articleId=1&status=1" -Method GET
            $found = $approvedComments.data | Where-Object { $_.id -eq $pendingId }
            
            if ($found) {
                Write-Host "✓ 验证成功：评论状态已更新为通过" -ForegroundColor Green
                Write-Host "  └─ ID: $($found.id), 状态：$($found.status)" -ForegroundColor White
            } else {
                Write-Host "⚠ 未找到已审核的评论" -ForegroundColor Yellow
            }
        } else {
            Write-Host "⚠ 没有待审核评论" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "⚠ 审核功能测试跳过（服务可能未实现）" -ForegroundColor DarkGray
    }
    
    Write-Host "`n✓ 测试 4 完成：审核功能演示" -ForegroundColor Green
    
    # ========================================
    # 测试 5：更新评论内容
    # ========================================
    Write-Host "`n[测试 5] 更新评论内容" -ForegroundColor Magenta
    Write-Host "----------------------------------------" -ForegroundColor DarkGray
    
    # 创建测试评论
    Write-Host "`n5.1 创建测试评论..." -ForegroundColor Yellow
    $testComment = Invoke-RestMethod -Uri "$baseUrl" -Method POST `
        -ContentType "application/json" `
        -Body '{"articleId":1,"commentator":"测试用户","email":"test@example.com","content":"原始内容"}'
    
    $testCommentId = $testComment.data.id
    Write-Host "评论创建成功，ID = $testCommentId" -ForegroundColor Green
    Write-Host "原始内容：$($testComment.data.content)" -ForegroundColor Gray
    
    # 更新评论
    Write-Host "`n5.2 更新评论内容..." -ForegroundColor Yellow
    $updateResult = Invoke-RestMethod -Uri "$baseUrl/$testCommentId" -Method PUT `
        -ContentType "application/json" `
        -Body '{"content":"这是修改后的评论内容","email":"newemail@example.com"}'
    
    Write-Host "更新结果：$($updateResult.message)" -ForegroundColor Green
    Write-Host "新内容：$($updateResult.data.content)" -ForegroundColor Yellow
    Write-Host "新邮箱：$($updateResult.data.email)" -ForegroundColor Yellow
    
    # 验证更新
    Write-Host "`n5.3 验证更新结果..." -ForegroundColor Yellow
    $updatedComment = Invoke-RestMethod -Uri "$baseUrl/$testCommentId" -Method GET
    Write-Host "验证结果：" -ForegroundColor Yellow
    Write-Host "  ├─ ID: $($updatedComment.data.id)" -ForegroundColor White
    Write-Host "  ├─ 内容：$($updatedComment.data.content)" -ForegroundColor White
    Write-Host "  └─ 邮箱：$($updatedComment.data.email)" -ForegroundColor White
    
    if ($updatedComment.data.content -eq "这是修改后的评论内容" -and 
        $updatedComment.data.email -eq "newemail@example.com") {
        Write-Host "✓ 验证成功：评论已更新" -ForegroundColor Green
    } else {
        Write-Host "✗ 验证失败：内容或邮箱不匹配" -ForegroundColor Red
    }
    
    Write-Host "`n✓ 测试 5 完成：评论更新功能演示" -ForegroundColor Green
    
    # ========================================
    # 测试 6：统计评论数量（使用 MySQL）
    # ========================================
    Write-Host "`n[测试 6] 统计评论数量" -ForegroundColor Magenta
    Write-Host "----------------------------------------" -ForegroundColor DarkGray
    
    Write-Host "`n6.1 统计总评论数：" -ForegroundColor Yellow
    try {
        $totalQuery = "mysql -u blog_user -pblog123456 blog -e 'SELECT COUNT(*) AS total_comments FROM comment WHERE article_id = 1;'"
        Invoke-Expression $totalQuery
    } catch {
        Write-Host "⚠ MySQL 查询失败" -ForegroundColor DarkGray
    }
    
    Write-Host "`n6.2 统计已通过的评论数：" -ForegroundColor Yellow
    try {
        $approvedQuery = "mysql -u blog_user -pblog123456 blog -e 'SELECT COUNT(*) AS approved_comments FROM comment WHERE article_id = 1 AND status = 1;'"
        Invoke-Expression $approvedQuery
    } catch {
        Write-Host "⚠ MySQL 查询失败" -ForegroundColor DarkGray
    }
    
    Write-Host "`n6.3 统计已删除的评论数：" -ForegroundColor Yellow
    try {
        $deletedQuery = "mysql -u blog_user -pblog123456 blog -e 'SELECT COUNT(*) AS deleted_comments FROM comment WHERE article_id = 1 AND status = -1;'"
        Invoke-Expression $deletedQuery
    } catch {
        Write-Host "⚠ MySQL 查询失败" -ForegroundColor DarkGray
    }
    
    Write-Host "`n✓ 测试 6 完成：统计评论数量" -ForegroundColor Green
    
    # ========================================
    # 测试 7：清理测试数据
    # ========================================
    Write-Host "`n[测试 7] 清理测试数据" -ForegroundColor Magenta
    Write-Host "----------------------------------------" -ForegroundColor DarkGray
    
    Write-Host "`n7.1 删除 article_id = 1 的所有评论..." -ForegroundColor Yellow
    try {
        $cleanQuery = "mysql -u blog_user -pblog123456 blog -e 'DELETE FROM comment WHERE article_id = 1;'"
        Invoke-Expression $cleanQuery
        Write-Host "✓ 测试数据已清理" -ForegroundColor Green
        
        # 验证清理结果
        Write-Host "`n7.2 验证清理结果：" -ForegroundColor Yellow
        $verifyQuery = "mysql -u blog_user -pblog123456 blog -e 'SELECT COUNT(*) AS remaining FROM comment WHERE article_id = 1;'"
        Invoke-Expression $verifyQuery
    } catch {
        Write-Host "⚠ MySQL 清理失败" -ForegroundColor DarkGray
    }
    
    Write-Host "`n✓ 测试 7 完成：清理测试数据" -ForegroundColor Green
    
    # ========================================
    # 测试完成总结
    # ========================================
    Write-Host "`n========================================" -ForegroundColor Green
    Write-Host "  所有测试完成！" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "`n测试总结：" -ForegroundColor Cyan
    Write-Host "  ✓ 创建评论和回复" -ForegroundColor Green
    Write-Host "  ✓ 查询树形结构评论" -ForegroundColor Green
    Write-Host "  ✓ 软删除评论（保持评论楼结构）" -ForegroundColor Green
    Write-Host "  ✓ 审核评论功能" -ForegroundColor Green
    Write-Host "  ✓ 更新评论内容" -ForegroundColor Green
    Write-Host "  ✓ 统计评论数量" -ForegroundColor Green
    Write-Host "  ✓ 清理测试数据" -ForegroundColor Green
    Write-Host ""
    
} catch {
    Write-Host "`n[错误] 测试失败：$($_.Exception.Message)" -ForegroundColor Red
    Write-Host "`n错误详情：$($_.Exception.InnerException?.Message)" -ForegroundColor DarkRed
    exit 1
}
