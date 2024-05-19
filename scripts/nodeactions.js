import { NexusNodeCreationDTO } from '../models/NexusNodeCreationDTO.js';
import { NexusNodeDataDTO } from '../models/NexusNodeDataDTO.js';
import { NexusNodeDTO } from '../models/nexusNodeDTO.js';

const endpoint = "https://nexusflow.azurewebsites.net/API/Nodes/";

// Function to get the root node
export async function getRootNode(accessToken) {
    try {
        const params = new URLSearchParams();
        params.append('accesstoken', accessToken);

        const response = await fetch(endpoint + "GetRoot?" + params);

        // Check if the response is ok
        if (!response.ok) {
            throw new Error("Failed to fetch root node. HTTP status code: " + response.status);
        }

        // Parse the JSON response
        const responseData = await response.json();
        const rootNode = new NexusNodeDTO(responseData.id, responseData.name, responseData.isStarred, responseData.dataType);

        // Return the root node
        return rootNode;
    } catch (error) {
        console.error("Error:", error);
        // Return null or handle the error appropriately
        return null;
    }
}

// Function to get children nodes
export async function getChildrenNodes(accessToken, parentId) {
    const params = new URLSearchParams();
    params.append('accesstoken', accessToken);
    params.append('parentid', parentId);

    try {
        const response = await fetch(endpoint + "GetChildren?" + params);

        if (!response.ok) {
            throw new Error("Failed to fetch children nodes. HTTP status code: ${response.status}");
        }

        const responseData = await response.json();
        // console.log(JSON.stringify(responseData));
        return responseData.map(node => new NexusNodeDTO(node.id, node.name, node.isStarred));
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
}

// Function to get parent node
export async function getParentNode(accessToken, nodeId) {
    const params = new URLSearchParams();
    params.append('accesstoken', accessToken);
    params.append('nodeid', nodeId);

    try {
        const response = await fetch(endpoint + "GetParent?" + params);

        if (!response.ok) {
            throw new Error("Failed to fetch parent node. HTTP status code: ${response.status}");
        }

        const responseData = await response.json();
        return new NexusNodeDTO(responseData.id, responseData.name, responseData.isStarred, responseData.dataType);
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
}

// Function to get node data
export async function getNodeData(accessToken, nodeId) {
    const params = new URLSearchParams();
    params.append('accesstoken', accessToken);
    params.append('nodeid', nodeId);

    try {
        const response = await fetch(endpoint + "GetData?" + params);

        if (!response.ok) {
            throw new Error("Failed to fetch node data. HTTP status code: ${response.status}");
        }

        const responseData = await response.json();
        return new NexusNodeDataDTO(responseData.data, responseData.createdDateTime, responseData.lastModifiedDateTime);
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
}

// Function to add a new node
export async function addNode(accessToken, parentId, newNode) {
    const params = new URLSearchParams();
    params.append('accesstoken', accessToken);
    params.append('parentid', parentId);

    try {
        const response = await fetch(endpoint + "Add?" + params, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newNode)
        });

        if (!response.ok) {
            throw new Error("Failed to add node. HTTP status code: ${response.status}");
        }

        const responseData = await response.json();
        return new NexusNodeDTO(responseData.id, responseData.name, responseData.isStarred);
    
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
}

// Function to delete a node
export async function deleteNode(accessToken, nodeId) {
    const params = new URLSearchParams();
    params.append('accesstoken', accessToken);
    params.append('nodeid', nodeId);

    try {
        const response = await fetch(endpoint + "Delete?" + params, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error("Failed to delete node. HTTP status code: ${response.status}");
        }

        return true;
    } catch (error) {
        console.error("Error:", error);
        return false;
    }
}

// Function to edit a node
export async function editNode(accessToken, nodeId, newNode) {
    const params = new URLSearchParams();
    params.append('accesstoken', accessToken);
    params.append('nodeid', nodeId);

    try {
        const response = await fetch(endpoint + "Edit?" + params, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newNode)
        });

        if (!response.ok) {
            throw new Error("Failed to edit node. HTTP status code: ${response.status}");
        }

        return true;
    
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
}

// Function go get all starred nodes
export async function getStarredNodes(accessToken) {
    const params = new URLSearchParams();
    params.append('accesstoken', accessToken);

    try {
        const response = await fetch(endpoint + "GetStarred?" + params);

        if (!response.ok) {
            throw new Error("Failed to fetch starred nodes. HTTP status code: ${response.status}");
        }

        const responseData = await response.json();
        return responseData.map(node => new NexusNodeDTO(node.id, node.name, node.isStarred));
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
}



