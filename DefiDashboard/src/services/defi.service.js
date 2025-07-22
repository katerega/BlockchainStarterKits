import axios from "axios";

const KEY = import.meta.env.VITE_GRAPH_API_KEY;
const ID = import.meta.env.VITE_SUBGRAPH_ID;

export const fetchDaoData = async () => {

    try {
        // 1. First fetch all DAOs (using daoMetas as per your working query)
        const daosRes = await axios.post(
            `https://gateway.thegraph.com/api/${KEY}/subgraphs/id/${ID}`,
            {
                query: `
          {
            daoMetas(first: 100, orderDirection: desc) {
              id
              title
              # Include any other available fields
            }
          }
        `,
            }
        );

        const daos = daosRes.data.data.daoMetas.filter(dao => dao.title);
        console.log("Found DAOs:", daos.length);

        // 2. Fetch activity for each DAO using the correct relationships
        const daoDetails = await Promise.all(
            daos.map(async (dao) => {
                try {
                    // Option 1: Try querying by DAO ID in related entities
                    const activityRes = await axios.post(
                        `https://gateway.thegraph.com/api/${KEY}/subgraphs/id/${ID}`,
                        {
                            query: `
                {
                  # Query transactions related to this DAO
                  transactions(where: { dao: "${dao.id.toLowerCase()}" }, first: 5) {
                    id
                    value
                    timestamp
                    # Include other transaction fields
                  }
                  
                  # Query proposals related to this DAO
                  proposals(where: { dao: "${dao.id.toLowerCase()}" }, first: 5) {
                    id
                    title
                    description
                    createdAt
                    status
                    # Include other proposal fields
                  }
                }
              `,
                        }
                    );

                    return {
                        ...dao,
                        transactions: activityRes.data.data?.transactions || [],
                        proposals: activityRes.data.data?.proposals || [],
                    };

                } catch (err) {
                    console.error(`Error fetching activity for DAO ${dao.id}`, err);
                    return {
                        ...dao,
                        transactions: [],
                        proposals: [],
                        error: err.message
                    };
                }
            })
        );

        // 3. Format the final output
        const result = daoDetails.map(dao => ({
            id: dao.id,
            name: dao.title,
            stats: {
                totalTransactions: dao.transactions.length,
                totalProposals: dao.proposals.length,
                latestActivity: dao.transactions[0]?.timestamp || dao.proposals[0]?.createdAt || null
            },
            transactions: dao.transactions.map(tx => ({
                id: tx.id,
                value: tx.value,
                timestamp: tx.timestamp
            })),
            proposals: dao.proposals.map(p => ({
                id: p.id,
                title: p.title || 'Untitled',
                status: p.status || 'unknown',
                timestamp: p.createdAt
            })),
            proposalsLen: dao.proposals.length,
            txs: dao.transactions.length
        }));
        console.log("Final DAO Data:", result);
        return result;

    } catch (err) {
        console.error("Error in fetchDaoData:", err);
        throw err;
    }
};

export const graphFields = async () => {
    const resp = await axios.post(
        `https://gateway.thegraph.com/api/${KEY}/subgraphs/id/${ID}`,
        {
            query: `
    {
      __schema {
        queryType {
          fields {
            name
          }
        }
      }
    }
    `
        }
    );
    console.log(resp.data.data.__schema.queryType.fields);
}


export const fetchTokens = async (limit = 2689) => {
    const response = await axios.get(`https://vaultx-be.onrender.com/api/all-tokens/wallets?limit=${limit}&convert=UGX`);

    const tokens = response.data.data.map(({ id, name, total_supply, platform }) => {
        const cleanSupply = typeof total_supply === 'string'
            ? Number(total_supply.replace(/,/g, ''))
            : total_supply;

        const platformName = platform?.name
            ? `${name} (${platform.name})`
            : name;

        return {
            id,
            token: platformName,
            transfers: cleanSupply,
        };
    });

    console.log("Final Token Data:", tokens);

    return tokens;
};

export const fetchNfts = async (limit = 2689) => {
    const response = await axios.get(`https://vaultx-be.onrender.com/api/all-tokens/wallets?limit=${limit}&convert=UGX`);

    const volumesByMonth = {};

    response.data.data.forEach(({ quote }) => {
        const { UGX } = quote;
        const { volume_24h, last_updated } = UGX;

        const date = new Date(last_updated);
        const monthYear = `${date.toLocaleString('default', { month: 'short' })}-${date.getFullYear()}`; // e.g., Jul-2025

        // Add or update volume
        volumesByMonth[monthYear] = (volumesByMonth[monthYear] || 0) + (volume_24h ?? 0);
    });

    // Convert to array format
    const nfts = Object.entries(volumesByMonth).map(([month, volume]) => ({
        month,
        volume: parseFloat(volume.toFixed(2)), // optional rounding
    }));

    console.log("Final NFTs Data:", nfts);

    return nfts
};

