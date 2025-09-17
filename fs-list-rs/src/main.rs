use anyhow::Result;
use serde::Deserialize;
use std::fs;

use rmcp::{
    ErrorData as McpError,
    handler::server::{
        router::tool::ToolRouter,
        wrapper::Parameters,
        ServerHandler,
    },
    model::{CallToolResult, Content, ErrorCode, ServerCapabilities, ServerInfo},
    service::ServiceExt,
    tool, tool_handler, tool_router,
};
use rmcp::schemars::{self, JsonSchema};

#[derive(Deserialize, JsonSchema)]
struct ListArgs {
    /// Absolute or relative directory path
    path: String,
}

#[derive(Clone)]
struct FsList {
    tool_router: ToolRouter<Self>,
}

#[tool_router]
impl FsList {
    fn new() -> Self {
        Self { tool_router: Self::tool_router() }
    }

    #[tool(name = "list_dir", description = "List entries in a directory")]
    async fn list_dir(&self, params: Parameters<ListArgs>) -> Result<CallToolResult, McpError> {
        let entries = fs::read_dir(&params.0.path)
            .map_err(|e| McpError::new(ErrorCode(-1), e.to_string(), None))?
            .filter_map(|e| e.ok())
            .filter_map(|e| e.file_name().into_string().ok())
            .collect::<Vec<_>>()
            .join("\n");

        Ok(CallToolResult::success(vec![Content::text(entries)]))
    }
}

#[tool_handler]
impl ServerHandler for FsList {
    fn get_info(&self) -> ServerInfo {
        ServerInfo {
            capabilities: ServerCapabilities::builder().enable_tools().build(),
            instructions: Some("List directory entries".into()),
            ..Default::default()
        }
    }
}

#[tokio::main]
async fn main() -> Result<()> {
    use tokio::io::{stdin, stdout};
    let transport = (stdin(), stdout());

    let server = FsList::new().serve(transport).await?;
    server.waiting().await?;
    Ok(())
}
