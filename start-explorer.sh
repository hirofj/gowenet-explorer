#!/bin/bash

# GOWENET Block Explorer Management Script

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PID_FILE="$SCRIPT_DIR/.explorer.pid"
LOG_FILE="$SCRIPT_DIR/explorer.log"

show_usage() {
    echo "Usage: $0 [start|stop|restart|status]"
    echo ""
    echo "Commands:"
    echo "  start    - Start the GOWENET Block Explorer"
    echo "  stop     - Stop the GOWENET Block Explorer"
    echo "  restart  - Restart the GOWENET Block Explorer"
    echo "  status   - Show the current status"
    echo ""
    echo "If no command is specified, 'start' is assumed."
}

check_node_version() {
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 20 ]; then
        echo "❌ Error: Node.js 20 or higher is required"
        echo "   Current version: $(node -v)"
        echo "   Please upgrade Node.js first"
        return 1
    fi
    return 0
}

check_gowenet_node() {
    echo "Checking GOWENET node connection..."
    RPC_URL="http://192.168.3.86:9654/ext/bc/2tGwFCjwr3w6fW774ytz982h5Th9eiALrKFanmBKZjxQSqTBxW/rpc"
    RESPONSE=$(curl -s -X POST --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
      -H 'content-type:application/json' $RPC_URL 2>/dev/null)

    if echo "$RESPONSE" | grep -q "result"; then
        BLOCK_HEX=$(echo $RESPONSE | grep -o '"result":"[^"]*"' | cut -d'"' -f4)
        BLOCK_NUM=$((16#${BLOCK_HEX:2}))
        echo "✓ GOWENET node is running (Latest block: $BLOCK_NUM)"
        return 0
    else
        echo "⚠️  Warning: Cannot connect to GOWENET node at $RPC_URL"
        return 1
    fi
}

get_next_dev_pid() {
    # Find next dev process in this directory
    ps aux | grep "next dev" | grep "$SCRIPT_DIR" | grep -v grep | awk '{print $2}' | head -1
}

start_explorer() {
    echo "=========================================="
    echo "  GOWENET Block Explorer - Starting"
    echo "=========================================="
    echo ""

    # Check if already running
    EXISTING_PID=$(get_next_dev_pid)
    if [ -n "$EXISTING_PID" ]; then
        echo "❌ Explorer is already running (PID: $EXISTING_PID)"
        echo "   Use '$0 stop' to stop it first"
        return 1
    fi

    # Check Node.js version
    if ! check_node_version; then
        return 1
    fi

    echo "✓ Node.js version: $(node -v)"
    echo "✓ npm version: $(npm -v)"
    echo ""

    # Check GOWENET node
    if ! check_gowenet_node; then
        echo ""
        read -p "Continue anyway? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            return 1
        fi
    fi

    echo ""
    echo "Starting GOWENET Block Explorer in background..."
    echo ""

    # Start in background
    cd "$SCRIPT_DIR"
    nohup npm run dev > "$LOG_FILE" 2>&1 &
    NEW_PID=$!
    echo $NEW_PID > "$PID_FILE"

    # Wait a bit and check if it started
    sleep 3
    if ps -p $NEW_PID > /dev/null 2>&1; then
        echo "✓ Explorer started successfully! (PID: $NEW_PID)"
        echo ""
        echo "Access URLs:"
        echo "  Local:   http://localhost:3000"
        echo "  Network: http://192.168.3.86:3000"
        echo ""
        echo "Logs: tail -f $LOG_FILE"
        echo "Stop: $0 stop"
        echo "=========================================="
    else
        echo "❌ Failed to start explorer"
        echo "   Check logs: cat $LOG_FILE"
        rm -f "$PID_FILE"
        return 1
    fi
}

stop_explorer() {
    echo "=========================================="
    echo "  GOWENET Block Explorer - Stopping"
    echo "=========================================="
    echo ""

    # Try to get PID from file first
    if [ -f "$PID_FILE" ]; then
        PID=$(cat "$PID_FILE")
    else
        # Try to find running process
        PID=$(get_next_dev_pid)
    fi

    if [ -z "$PID" ]; then
        echo "❌ Explorer is not running"
        rm -f "$PID_FILE"
        return 1
    fi
    
    if ! ps -p $PID > /dev/null 2>&1; then
        echo "⚠️  Process not found (stale PID)"
        rm -f "$PID_FILE"
        # Try to find and kill any next dev process
        ACTUAL_PID=$(get_next_dev_pid)
        if [ -n "$ACTUAL_PID" ]; then
            echo "Found running process (PID: $ACTUAL_PID), stopping..."
            PID=$ACTUAL_PID
        else
            return 1
        fi
    fi

    echo "Stopping explorer (PID: $PID)..."
    
    # Kill the process tree
    pkill -P $PID 2>/dev/null
    kill $PID 2>/dev/null

    # Wait for process to stop
    for i in {1..10}; do
        if ! ps -p $PID > /dev/null 2>&1; then
            echo "✓ Explorer stopped successfully"
            rm -f "$PID_FILE"
            return 0
        fi
        sleep 1
    done

    # Force kill if still running
    echo "⚠️  Forcing stop..."
    pkill -9 -P $PID 2>/dev/null
    kill -9 $PID 2>/dev/null
    rm -f "$PID_FILE"
    echo "✓ Explorer stopped (forced)"
}

status_explorer() {
    echo "=========================================="
    echo "  GOWENET Block Explorer - Status"
    echo "=========================================="
    echo ""

    # Try PID file first
    if [ -f "$PID_FILE" ]; then
        PID=$(cat "$PID_FILE")
    else
        PID=$(get_next_dev_pid)
    fi

    if [ -z "$PID" ] || ! ps -p $PID > /dev/null 2>&1; then
        echo "Status: ❌ Not running"
        rm -f "$PID_FILE"
        return 1
    fi

    echo "Status: ✓ Running (PID: $PID)"
    echo ""
    echo "Access URLs:"
    echo "  Local:   http://localhost:3000"
    echo "  Network: http://192.168.3.86:3000"
    echo ""
    echo "Logs: tail -f $LOG_FILE"
    
    # Show GOWENET node status
    echo ""
    check_gowenet_node
}

restart_explorer() {
    echo "Restarting GOWENET Block Explorer..."
    echo ""
    stop_explorer
    sleep 2
    start_explorer
}

# Main script
case "${1:-start}" in
    start)
        start_explorer
        ;;
    stop)
        stop_explorer
        ;;
    restart)
        restart_explorer
        ;;
    status)
        status_explorer
        ;;
    *)
        echo "❌ Unknown command: $1"
        echo ""
        show_usage
        exit 1
        ;;
esac
