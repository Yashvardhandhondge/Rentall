import {
    GraphQLObjectType as ObjectType,
    GraphQLID as ID,
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
    GraphQLString as StringType,
    GraphQLList as List,
} from 'graphql';
// Models
import { WishList } from '../models';
// Types
import WishListType from './WishListType';

const WishListGroupType = new ObjectType({
    name: 'WishListGroup',
    fields: {
        id: { type: IntType },
        name: { type: StringType },
        userId: { type: new NonNull(ID) },
        isPublic: { type: StringType },
        createdAt: { type: StringType },
        updatedAt: { type: StringType },
        status: { type: IntType },
        errorMessage: { type: StringType },
        currentPage: { type: IntType },
        wishListCount: {
            type: IntType, 
            async resolve(wishListGroup) {
                return await WishList.count({
                    where: {
                        wishListGroupId: wishListGroup.id,
                        isListActive: true
                    }
                });
            }    
        },
        wishListCover: {
            type: WishListType,
            async resolve(wishListGroup) {
                return await WishList.findOne({
                    where: {
                        wishListGroupId: wishListGroup.id,
                        isListActive: true
                    },
                    order: [
                        ['id', 'DESC']
                    ]    
                })
            }
        },
        wishLists: {
            type: new List(WishListType),
            async resolve(wishListGroup) {
                const limit = 10;
                let offset = 0;
                // Offset from Current Page
                if (wishListGroup.currentPage) {
                    offset = (wishListGroup.currentPage - 1) * limit;
                    return await WishList.findAll({
                        where: {
                            wishListGroupId: wishListGroup.id,
                            isListActive: true
                        },
                        order: [
                            ['id', 'DESC']
                        ],
                        limit,
                        offset
                    })
                }else{
                    return await WishList.findAll({
                        where: {
                            wishListGroupId: wishListGroup.id,
                            isListActive: true
                        },
                        order: [
                            ['id', 'DESC']
                        ]
                    })
                }
            }
        },
        wishListIds: {
            type: new List(IntType),
            async resolve(wishListGroup) {
                let response = [];
                const listIdsData = await WishList.findAll({
                    attributes: ['listId'],
                    where: {
                        wishListGroupId: wishListGroup.id
                    },
                    order: [
                        ['id', 'DESC']
                    ]
                });
                if (listIdsData.length) {
                    listIdsData.map((item, index) => {
                        response.push(parseInt(item.listId));
                    });
                }
                return response;
            }
        }
    }
});

export default WishListGroupType;