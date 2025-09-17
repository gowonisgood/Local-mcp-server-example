package main

import (
	"context"
	"fmt"
	"runtime"
	"time"

	mcp "github.com/mark3labs/mcp-go/mcp"
	"github.com/mark3labs/mcp-go/server"
)

func main() {
	start := time.Now()

	// 1) 서버 생성
	s := server.NewMCPServer(
		"sysinfo",
		"0.1.0",
		server.WithToolCapabilities(false), // 필요시 기능 플래그
	)

	// 2) 도구 정의 (입력 없음: object 스키마)
	uptimeTool := mcp.NewTool(
		"uptime",
		mcp.WithDescription("Return OS and uptime seconds (since server start)"),
	)

	// 3) 핸들러 등록
	s.AddTool(uptimeTool, func(ctx context.Context, req mcp.CallToolRequest) (*mcp.CallToolResult, error) {
		out := fmt.Sprintf("GOOS=%s; UptimeSinceStart=%d",
			runtime.GOOS, int(time.Since(start).Seconds()))
		return mcp.NewToolResultText(out), nil
	})

	// 4) stdio로 실행
	if err := server.ServeStdio(s); err != nil {
		fmt.Printf("Server error: %v\n", err)
	}
}
