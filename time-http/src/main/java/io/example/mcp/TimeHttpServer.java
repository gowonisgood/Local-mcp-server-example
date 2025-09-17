package io.example.mcp;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.time.ZonedDateTime;

public class TimeHttpServer {
    public static void main(String[] args) throws Exception {
        BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));
        String line;

        // Log startup to stderr
        System.err.println("MCP Time Server started via stdio");

        while ((line = reader.readLine()) != null) {
            try {
                JSONObject request = new JSONObject(line);
                JSONObject response = handleMcpRequest(request);
                System.out.println(response.toString());
                System.out.flush();
            } catch (Exception e) {
                System.err.println("Error processing request: " + e.getMessage());
                JSONObject errorResponse = new JSONObject();
                errorResponse.put("jsonrpc", "2.0");
                errorResponse.put("id", JSONObject.NULL);
                JSONObject error = new JSONObject();
                error.put("code", -32603);
                error.put("message", "Internal error");
                errorResponse.put("error", error);
                System.out.println(errorResponse.toString());
                System.out.flush();
            }
        }
    }

    private static JSONObject handleMcpRequest(JSONObject request) {
        String method = request.optString("method", "");
        Object id = request.opt("id");

        JSONObject response = new JSONObject();
        response.put("jsonrpc", "2.0");
        response.put("id", id);

        switch (method) {
            case "initialize":
                JSONObject initResult = new JSONObject();
                initResult.put("protocolVersion", "2024-11-05");
                JSONObject capabilities = new JSONObject();
                JSONObject tools = new JSONObject();
                tools.put("listChanged", false);
                capabilities.put("tools", tools);
                initResult.put("capabilities", capabilities);
                JSONObject serverInfo = new JSONObject();
                serverInfo.put("name", "time-http");
                serverInfo.put("version", "0.1.0");
                initResult.put("serverInfo", serverInfo);
                response.put("result", initResult);
                break;

            case "tools/list":
                JSONObject toolsResult = new JSONObject();
                JSONArray toolsArray = new JSONArray();
                JSONObject nowTool = new JSONObject();
                nowTool.put("name", "now");
                nowTool.put("description", "Return current server time (ISO8601)");
                nowTool.put("inputSchema", new JSONObject().put("type", "object").put("properties", new JSONObject()));
                toolsArray.put(nowTool);
                toolsResult.put("tools", toolsArray);
                response.put("result", toolsResult);
                break;

            case "tools/call":
                JSONObject params = request.optJSONObject("params");
                if (params != null && "now".equals(params.optString("name"))) {
                    JSONObject callResult = new JSONObject();
                    JSONArray content = new JSONArray();
                    JSONObject textContent = new JSONObject();
                    textContent.put("type", "text");
                    textContent.put("text", ZonedDateTime.now().toString());
                    content.put(textContent);
                    callResult.put("content", content);
                    response.put("result", callResult);
                } else {
                    JSONObject error = new JSONObject();
                    error.put("code", -32602);
                    error.put("message", "Unknown tool");
                    response.put("error", error);
                }
                break;

            default:
                JSONObject error = new JSONObject();
                error.put("code", -32601);
                error.put("message", "Method not found");
                response.put("error", error);
                break;
        }

        return response;
    }
}
