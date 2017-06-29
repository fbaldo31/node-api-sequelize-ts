/**
 * Created by Frederick BALDO on 29/06/2017.
 */
import * as Agent from 'agentkeepalive';
export const AgentParams = new Agent ({
    maxSockets: 100,
    maxFreeSockets: 10,
    timeout: 60000,
    freeSocketKeepAliveTimeout: 30000, // free socket keepalive for 30 seconds
});
